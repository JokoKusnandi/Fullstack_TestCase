from django.db import models
from users.models import User


class Document(models.Model):

    STATUS_CHOICES = (
        ("ACTIVE", "ACTIVE"),
        ("PENDING_DELETE", "PENDING_DELETE"),
        ("PENDING_REPLACE", "PENDING_REPLACE"),
        # ("APPROVED", "APPROVED"), 
        # ("REJECTED", "REJECTED")
    )

    DOCUMENT_TYPE_CHOICES = (
        ("PDF", "PDF"),
        ("DOC", "DOC"),
        ("IMG", "Image"),
        ("OTHER", "Other"),
    )
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    documentType = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPE_CHOICES
    )
    file = models.FileField(upload_to="documents/")
    version = models.IntegerField(default=1)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    createdBy = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="documents"
    )
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (v{self.version})"
