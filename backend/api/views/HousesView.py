# views.py
from rest_framework import generics
from ..models import refHouse
from ..serializers import HouseSerializer


class HousesView(generics.ListAPIView):
    serializer_class = HouseSerializer
    
    def get_queryset(self):        
        street_id = self.request.query_params.get('street_id', None)        
        if street_id:
            queryset = refHouse.objects.using('Bill').filter(street=street_id)
        else:
            queryset = refHouse.objects.using('Bill').all() 
        return queryset