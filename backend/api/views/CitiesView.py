# views.py
from rest_framework import generics
from ..models import refCity
from ..serializers import CitySerializer

class CitiesView(generics.ListAPIView):
    serializer_class = CitySerializer

    def get_queryset(self):
        queryset = refCity.objects.using('Bill').exclude(id=0)
        return queryset