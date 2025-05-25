from django.urls import path
from .views.DetectServiceView import DetectServiceView
from .views.TransferPaymentView import TransferPaymentView


urlpatterns = [
    path("detect/service/", DetectServiceView.as_view(), name="detect_service"),
    path("transfer/payment/", TransferPaymentView.as_view(), name="transfer_payment"),
]