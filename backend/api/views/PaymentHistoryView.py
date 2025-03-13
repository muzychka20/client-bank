from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import connections
from api.helper.helper import send_error, send_warning
from api.models import refKlientBankStatus


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
                        "status": {"id": record[9], "name": refKlientBankStatus.objects.filter(uid=record[9]).first().name},
                        "n_p": record[6],
                        "client_name": record[16],
                        "address": record[17],
                    })
                    total_sum += record[3]

            if records:
                # Implement pagination
                page_size = 10
                page = int(request.GET.get("page", 1)) # Default to page 1 if no page query parameter is given
                start_index = (page - 1) * page_size
                end_index = page * page_size
                paginated_records = records[start_index:end_index]

                return Response(
                    {
                        'records': paginated_records,
                        'count_record': len(records),
                        'sum_record': total_sum,
                        'total_pages': (len(records) // page_size) + (1 if len(records) % page_size > 0 else 0),
                        'current_page': page
                    },
                    status=status.HTTP_200_OK)
            else:
                return send_warning("No payments on that day!", "Warning!")
        except Exception as error:
            print(error)
            return send_error(error, "Error!")
