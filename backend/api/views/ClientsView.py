# views.py
from rest_framework import generics
from ..models import refClient
from ..serializers import ClientSerializer

class ClientsView(generics.ListAPIView):
    queryset = refClient.objects.all()
    serializer_class = ClientSerializer