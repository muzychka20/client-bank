# views.py
from rest_framework import generics
from ..models import refLocation
from ..serializers import LocationSerializer


class LocationsView(generics.ListAPIView):
    queryset = refLocation.objects.using('Bill').all()
    serializer_class = LocationSerializer
