from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import PermissionRequest
from .permissions import IsAdminRole

from .models import PermissionRequest



class AdminApprovalView(APIView):
    permission_classes = [IsAuthenticated,IsAdminRole]

    def get(self, request):
        if request.user.role != "ADMIN":
            return Response({"detail": "Forbidden"}, status=403)

        qs = PermissionRequest.objects.filter( status__in=["PENDING_DELETE", "PENDING_REPLACE"])
        data = [
            {
                "id": p.id,
                "document": p.document.title,
                "action": p.request_type,
                "status": p.status, 
                "requester": p.requested_by.username,
                "created_at": p.created_at,
            }
            for p in qs
        ]
        return Response(data)

    def post(self, request, pk):
        # if request.user.role != "ADMIN":
        #     return Response({"detail": "Forbidden"}, status=403)
        pr = get_object_or_404(
            PermissionRequest,
            pk=pk,
            status__in=["PENDING_DELETE", "PENDING_REPLACE"]
        )

        decision = request.data.get("decision")  # APPROVE / REJECT
        # pr = PermissionRequest.objects.get(id=pk)

        if decision == "APPROVE":
            pr.status = "APPROVED"
            pr.document.status = "ACTIVE"
            pr.document.save()
        elif decision == "REJECT":
            pr.status = "REJECTED"
        else:
            # pr.status = "REJECTED"
            return Response({"detail": "Invalid decision"}, status=400)

        pr.approved_by = request.user
        pr.approved_at = timezone.now()
        pr.save()
        return Response({"status": pr.status})

class AdminHistoryView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        qs = PermissionRequest.objects.filter(
            status__in=["APPROVED", "REJECTED"]
        ).select_related("document", "requested_by", "approved_by")

        data = [
            {
                "id": p.id,
                "document": p.document.title,
                "action": p.request_type,
                "status": p.status,
                "requester": p.requested_by.username,
                "approved_by": p.approved_by.username if p.approved_by else None,
                "approved_at": p.approved_at,
            }
            for p in qs
        ]

        return Response(data)


#GET /api/permissions/ (List Pending)
class PermissionListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        qs = PermissionRequest.objects.filter( 
            status__in=["PENDING_DELETE", "PENDING_REPLACE"]
            )
        data = [
            {
                "id": p.id,
                "document": p.document.title,
                "action": p.request_type,
                "status": p.status,
                "requester": p.requested_by.username,
                "created_at": p.created_at,
            }
            for p in qs
        ]
        return Response(data)

#POST /api/permissions/{id}/approve
class PermissionApproveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        perm = get_object_or_404(
            PermissionRequest, 
            pk=pk, 
            # status__in=["PENDING_DELETE", "PENDING_REPLACE"]
            status__startswith="PENDING"
            )
        # doc = perm.document

        # if perm.status == "PENDING_DELETE":
        #     perm.delete()
        # elif perm.status == "PENDING_REPLACE":
        #     perm.status = "ACTIVE"
        #     perm.version += 1
        #     perm.save()
        
        perm.status = "APPROVED"
        perm.approved_by = request.user
        perm.approved_at  = timezone.now()
        perm.save()

        # update document
        doc = perm.document
        doc.status = "ACTIVE"
        doc.save()

        return Response({"status": "Approved successfully"})

#POST /api/permissions/{id}/reject

class PermissionRejectView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        perm = get_object_or_404(
            PermissionRequest, 
            pk=pk, 
            # status__in=["PENDING_DELETE", "PENDING_REPLACE"]
            status__startswith="PENDING"
            )
        # doc = perm.document

        # if not perm.status.startswith("PENDING"):
        #     return Response(
        #         {"detail": "Already processed"},
        #         status=400
        #     )

        perm.status = "REJECTED"
        perm.approved_by = request.user
        perm.approved_at = timezone.now()
        perm.save()

        # document balik ke ACTIVE
        doc = perm.document
        doc.status = "ACTIVE"
        doc.save()

        return Response({"status": "Rejected successfully"})
