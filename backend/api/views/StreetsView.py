from rest_framework import generics
from ..models import refStreet
from ..serializers import StreetSerializer


class StreetsView(generics.ListAPIView):
    queryset = refStreet.objects.using('Bill').all()
    serializer_class = StreetSerializer