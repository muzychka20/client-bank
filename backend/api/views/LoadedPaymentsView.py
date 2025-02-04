from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.helper.helper import send_error, send_warning
from ..models import wtKlientBankTemp


class LoadedPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            records = []
            items = wtKlientBankTemp.objects.all()
            total_sum = 0

            for record in items:
                records.append({
                    "date": record.Date,
                    "num_doc": record.NumDoc,
                    "sum": record.Summa,
                    "status": 0,
                    "n_p": record.NaznP,
                    "client_name": "",
                    "address": "",
                })
                total_sum += record.Summa

            if records:
                return Response({'records': records, 'count_record': len(records), 'sum_record': total_sum}, status=status.HTTP_200_OK)
            else:
                return send_warning("No loaded data!", "Warning!")
        except Exception as error:
            return send_error(error, "Error!")
