from django.urls import path
from .views.UploadFileView import UploadFileView
from .views.PaymentHistoryView import PaymentHistoryView

urlpatterns = [
    path("upload/file/", UploadFileView.as_view(), name="upload_file"),
    path("payments/history/", PaymentHistoryView.as_view(), name="payment_history"),
]
