# views.py
from rest_framework import generics
from ..models import refCity
from ..serializers import CitySerializer

class CitiesView(generics.ListAPIView):
    queryset = refCity.objects.using('Bill').all()
    serializer_class = CitySerializer
