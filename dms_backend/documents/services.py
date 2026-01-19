from notifications.models import Notification
from django.contrib.auth import get_user_model


def notify_admin(document, action, user):
    User = get_user_model()
    admins = User.objects.filter(role="ADMIN")

    for admin in admins:
        Notification.objects.create(
            user=admin,
            title=f"Document {action} Request",
            message=f"{user.username} requested {action} for '{document.title}'"
        )
