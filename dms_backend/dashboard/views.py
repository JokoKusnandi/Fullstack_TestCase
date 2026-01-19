from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from documents.models import Document
from permissions.models import PermissionRequest


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        data = {
            "username": user.username,
            "role": user.role,
            "total_documents": Document.objects.filter(owner=user).count(),
        }

        if user.role == "ADMIN":
            data["pending_requests"] = PermissionRequest.objects.filter(
                status="PENDING"
            ).count()
        else:
            data["pending_requests"] = PermissionRequest.objects.filter(
                requester=user,
                status="PENDING"
            ).count()

        return Response(data)
