from django.db import models
from users.models import User
from documents.models import Document


class PermissionRequest(models.Model):

    REQUEST_TYPE_CHOICES = (
        ("DELETE", "DELETE"),
        ("REPLACE", "REPLACE"),
    )

    STATUS_CHOICES = (
        ("PENDING_DELETE", "Pending Delete"),  
        ("PENDING_REPLACE", "Pending Replace"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    )

    # user = models.ForeignKey(User, on_delete=models.CASCADE)

    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="permission_requests"
    )

    request_type = models.CharField(
        max_length=10,
        choices=REQUEST_TYPE_CHOICES
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES
    )

    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="permission_requests"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    approved_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="approved_requests"
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"{self.request_type} - {self.document.title} ({self.status})"
