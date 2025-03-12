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
                return send_warning("No loaded data!", "Warning!")
        except Exception as error:
            return send_error(error, "Error!")
