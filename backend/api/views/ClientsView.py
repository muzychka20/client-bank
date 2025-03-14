# views.py
from rest_framework import generics
from ..models import refClient
from ..serializers import ClientSerializer

class ClientsView(generics.ListAPIView):
    serializer_class = ClientSerializer

    def get_queryset(self):
        location_id = self.request.query_params.get('location_id', None)
        if location_id:
            return refClient.objects.using('Bill').filter(location=location_id)
        return refClient.objects.none()
