from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import connections
from api.helper.helper import send_error, send_warning
from api.models import refKlientBankStatus

class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        try:
            with connections['Bill'].cursor() as cursor:
                date = request.GET.get("date")

                print(id)
                # Fetch a single record if ID is provided
                if id is not None:
                    cursor.execute("exec CB_GetHistoryClientBankById %s", [id])
                    row = cursor.fetchone()
                    if not row:
                        return send_warning(f"No payment found with ID {id}", "Warning!")

                    record = {
                        "date": row[1],
                        "dt_load": row[7], # date of importing in billing
                        "num_doc": row[2],
                        "sum": row[3],
                        "name_bank": row[5],
                        "status": {"id": row[9], "name": refKlientBankStatus.objects.using('Bill').filter(id=row[9]).first().name},
                        "n_p": row[6],
                        "client_name": row[16],
                        "address": row[17],
                    }
                    service_id = row[11]
                    cursor.execute("exec CB_GetPaymentInfoByService %s", [service_id])
                    row = cursor.fetchone()
                    if not row:
                        return send_warning(f"No service found with ID {id}", "Warning!")

                    client_payment_info = {
                        'room': row[0],
                        'room_id': row[1],
                        'house': row[2],
                        'house_id': row[3], 
                        'street': row[4],
                        'street_id': row[5],
                        'city': row[6],
                        'city_id': row[7],
                        'client_name': row[8],
                        'client_name_id': row[9],
                    }
                    
                    record['client_payment_info'] = client_payment_info
                    
                    return Response(record, status=status.HTTP_200_OK)

                # Fetch all records for the given date
                records = []
                total_sum = 0
                cursor.execute("exec CB_GetHistoryClientBank %s", [date])
                rows = cursor.fetchall()

                for record in rows:
                    records.append({
                        "id": record[0],
                        "date": record[1],
                        "num_doc": record[2],
                        "sum": record[3],
                        "status": {"id": record[9], "name": refKlientBankStatus.objects.using('Bill').filter(id=record[9]).first().name},
                        "n_p": record[6],
                        "client_name": record[16],
                        "address": record[17],
                    })
                    total_sum += record[3]

            if records:
                # Implement pagination
                page_size = 10
                page = int(request.GET.get("page", 1))
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
                    status=status.HTTP_200_OK
                )
            else:
                return send_warning("No payments on that day!", "Warning!")
        except Exception as error:
            print(error)
            return send_error(error, "Error!")
