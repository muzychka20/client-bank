from django.urls import path
from .views.UploadFileView import UploadFileView
from .views.PaymentHistoryView import PaymentHistoryView
from .views.LoadedPaymentsView import LoadedPaymentsView
from .views.CleanUploadedPaymentsView import CleanUploadedPaymentsView
from .views.ClientsView import ClientsView
from .views.CitiesView import CitiesView
from .views.StreetsView import StreetsView
from .views.HousesView import HousesView
from .views.LocationsView import LocationsView
from .views.SavePaymentView import SavePaymentView


urlpatterns = [
    path("upload/file/", UploadFileView.as_view(), name="upload_file"),
    path("payments/history/", PaymentHistoryView.as_view(), name="payment_history"),
    path("payments/history/<int:id>/", PaymentHistoryView.as_view(), name="payment_history_id"),
    path("payments/loaded/", LoadedPaymentsView.as_view(), name="payment_loaded"),
    path("payments/loaded/<int:id>/", LoadedPaymentsView.as_view(), name="payment_loaded_id"),
    path("payments/clear/", CleanUploadedPaymentsView.as_view(), name="payment_clear"),    
    path("payments/save/", SavePaymentView.as_view(), name="save_payment"),
    path("clients/", ClientsView.as_view(), name="clients"),
    path("cities/", CitiesView.as_view(), name="cities"),
    path("streets/", StreetsView.as_view(), name="streets"),
    path("houses/", HousesView.as_view(), name="houses"),
    path("locations/", LocationsView.as_view(), name="locations"),
]