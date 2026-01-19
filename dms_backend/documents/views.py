from xml.dom.minidom import DocumentType
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.shortcuts import get_object_or_404

from permissions.permissions import IsAdminRole, IsUserRole
from permissions.models import PermissionRequest

from .models import Document
from .serializers import DocumentSerializer
from .services import notify_admin



class DocumentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "size"


class DocumentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.GET.get("search")
        status = request.GET.get("status")

        qs = Document.objects.all().order_by("-createdAt")

        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        if status:
            # qs = qs.filter(status__iexact=status)
            if status == "PENDING":
                qs = qs.filter(status__in=["PENDING_DELETE", "PENDING_REPLACE"])
            else:
                qs = qs.filter(status=status)

        paginator = DocumentPagination()
        page  = paginator.paginate_queryset(qs, request)

        serializer = DocumentSerializer(
            page , many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

class DocumentCreateView(APIView):
    permission_classes = [IsAuthenticated, IsUserRole]

    def post(self, request):
        doc = Document.objects.create(
            title=request.data.get("title"),
            description=request.data.get("description"),
            documentType=request.data.get("documentType"),
            file=request.FILES.get("file"),
            createdBy=request.user
        )
        
        #VALIDATION 
        if not doc.title:
            return Response({"detail": "Title is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not doc.description:
            return Response({"detail": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not doc.documentType:
            return Response({"detail": "Document type is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not doc.file:
            return Response({"detail": "File is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = DocumentSerializer(doc, context={"request": request})
        # serializer.is_valid(raise_exception=True)
        # serializer.save(createdBy=request.user)
        return Response(serializer.data, status.HTTP_201_CREATED)

class DocumentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        doc = Document.objects.get(id=id)
        serializer = DocumentSerializer(doc, context={"request": request})
        return Response(serializer.data)

class RequestReplaceView(APIView):
    permission_classes = [IsAuthenticated, IsUserRole]

    def post(self, request, id):
        doc = get_object_or_404(Document, id=id, createdBy=request.user)

        # if doc.createdBy != request.user:
        #     return Response({"detail": "Forbidden"}, status=403)
        if doc.status != "ACTIVE":
            return Response({"detail": "Document locked"}, status=400)

        doc.status = "PENDING_REPLACE"
        doc.save()

        PermissionRequest.objects.create(
            document=doc,
            request_type="REPLACE",
            status="PENDING_REPLACE",
            requested_by=request.user,
        )

        # ✅ PEMANGGILAN YANG BENAR
        notify_admin(doc, "REPLACE", request.user)

        return Response({"message": "Replace request submitted"})

class RequestDeleteView(APIView):
    permission_classes = [IsAuthenticated,IsUserRole]

    def post(self, request, id):
        doc = get_object_or_404(
            Document,
            id=id,
            createdBy=request.user
        )

        # if doc.createdBy != request.user:
        #     return Response({"detail": "Forbidden"}, status=403)
        if doc.status != "ACTIVE":
            return Response({"detail": "Document locked"}, status=400)

        doc.status = "PENDING_DELETE"
        doc.save()

        PermissionRequest.objects.create(
            document=doc,
            request_type="DELETE",
            status="PENDING_DELETE",
            requested_by=request.user,
        )

        # ✅ PEMANGGILAN YANG BENAR
        notify_admin(doc, "DELETE", request.user)

        return Response({"message": "Delete request submitted"})


