from django.contrib import admin
from .models import PermissionRequest


@admin.register(PermissionRequest)
class PermissionRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "document",
        "request_type",
        "status",
        "requested_by",
        "created_at",
    )
    list_filter = ("status", "request_type")
