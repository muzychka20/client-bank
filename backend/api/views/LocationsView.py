# views.py
from rest_framework import generics
from ..models import refLocation
from ..serializers import LocationSerializer


class LocationsView(generics.ListAPIView):
    serializer_class = LocationSerializer
    
    def get_queryset(self):        
        house_id = self.request.query_params.get('house_id', None)        
        if house_id:
            queryset = refLocation.objects.using('Bill').filter(house=house_id)
        else:
            queryset = refLocation.objects.using('Bill').all()
        return queryset