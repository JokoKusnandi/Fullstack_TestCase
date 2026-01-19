from django.urls import path
from .views import (
    AdminApprovalView,
    AdminHistoryView,
    PermissionListView,
    PermissionApproveView,
    PermissionRejectView,
)

urlpatterns = [
    # path("", AdminApprovalView.as_view()),
    path("admin/history/", AdminHistoryView.as_view()),
    path("<int:pk>/", AdminApprovalView.as_view()),
    path("", PermissionListView.as_view()),
    path("<int:pk>/approve/", PermissionApproveView.as_view()),
    path("<int:pk>/reject/", PermissionRejectView.as_view()),
]
