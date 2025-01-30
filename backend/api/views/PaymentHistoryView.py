from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connections
from datetime import datetime


class PaymentHistoryView(APIView):    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connections['Bill'].cursor() as cursor:
            records = []
            query = """
                SELECT kb.*, cl.keyname, dbo.[kir_GetAdressByLocation](gr.location) AS address FROM wtKlientBank AS kb
                LEFT JOIN wtServices AS s ON s.id = kb.service_id
                LEFT JOIN refClient AS cl ON cl.id = s.client
                LEFT JOIN wtGroups AS gr ON gr.group_id = s.id
                WHERE kb.Date = %s;
            """
            cursor.execute(query, ['2025-01-16'])
            rows = cursor.fetchall()
            for record in rows:
                records.append({
                    "date": record[1],
                    "num_doc": record[2],
                    "sum": record[3],
                    "status": record[9],
                    "n_p": record[6],
                    "client_name": record[16],
                    "address": record[17],
                })
            return Response({'records': records}, status=status.HTTP_200_OK)
