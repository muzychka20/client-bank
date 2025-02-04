from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import connections
from api.helper.helper import send_error, send_warning


class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            with connections['Bill'].cursor() as cursor:
                date = request.GET.get("date")
                records = []
                total_sum = 0
                cursor.execute("exec CB_GetHistoryClientBank %s", [date])
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
                    total_sum += record[3]

            if records:
                return Response({'records': records, 'count_record': len(records), 'sum_record': total_sum}, status=status.HTTP_200_OK)
            else:
                return send_warning("No payments on that day!", "Warning!")
        except Exception as error:
            print(error)
            return send_error(error, "Error!")
