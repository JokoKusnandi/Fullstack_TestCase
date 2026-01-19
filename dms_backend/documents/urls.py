from django.urls import path
from .views import (
    DocumentCreateView,
    DocumentDetailView,
    DocumentListView,
    RequestReplaceView,
    RequestDeleteView,
)

urlpatterns = [
    path("", DocumentListView.as_view()),
    path("upload/", DocumentCreateView.as_view()),
    path("<int:id>/", DocumentDetailView.as_view()),
    path("<int:id>/request-replace/", RequestReplaceView.as_view()),
    path("<int:id>/request-delete/", RequestDeleteView.as_view()),
]
