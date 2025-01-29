from django.urls import path
from . import views

urlpatterns = [
    path("upload/file/", views.UploadFile.as_view(), name="upload_file"),    
]
