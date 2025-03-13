# views.py
from rest_framework import generics
from ..models import refHouse
from ..serializers import HouseSerializer


class HousesView(generics.ListAPIView):
    queryset = refHouse.objects.using('Bill').all()
    serializer_class = HouseSerializer