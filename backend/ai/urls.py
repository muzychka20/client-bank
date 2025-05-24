from django.urls import path
from .views.DetectServiceView import DetectServiceView


urlpatterns = [
    path("detect/service/", DetectServiceView.as_view(), name="detect_service"),
]