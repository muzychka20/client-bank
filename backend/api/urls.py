from django.urls import path
from .views.UploadFileView import UploadFileView
from .views.PaymentHistoryView import PaymentHistoryView
from .views.LoadedPaymentsView import LoadedPaymentsView
from .views.CleanUploadedPaymentsView import CleanUploadedPaymentsView

urlpatterns = [
    path("upload/file/", UploadFileView.as_view(), name="upload_file"),
    path("payments/history/", PaymentHistoryView.as_view(), name="payment_history"),
    path("payments/history/<int:id>/", PaymentHistoryView.as_view(), name="payment_history_id"),
    path("payments/loaded/", LoadedPaymentsView.as_view(), name="payment_loaded"),
    path("payments/loaded/<int:id>/", LoadedPaymentsView.as_view(), name="payment_loaded_id"),
    path("payments/clear/", CleanUploadedPaymentsView.as_view(), name="payment_clear"),    
]
