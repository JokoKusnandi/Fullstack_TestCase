from django.urls import path
from .views import NotificationListView, NotificationReadView

urlpatterns = [
    path("", NotificationListView.as_view()),
    path("<int:id>/read/", NotificationReadView.as_view()),
]
