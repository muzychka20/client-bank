from rest_framework import generics
from ..models import refStreet
from ..serializers import StreetSerializer


class StreetsView(generics.ListAPIView):
    serializer_class = StreetSerializer
    
    def get_queryset(self):        
        city_id = self.request.query_params.get('city_id', None)        
        if city_id:
            queryset = refStreet.objects.using('Bill').filter(city=city_id)
        else:
            queryset = refStreet.objects.using('Bill').all()
        return queryset