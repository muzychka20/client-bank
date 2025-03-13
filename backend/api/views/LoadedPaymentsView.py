from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.helper.helper import send_error, send_warning
from ..models import wtKlientBankTemp, refKlientBankStatus


class LoadedPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        try:            
            status_obj = refKlientBankStatus.objects.using('Bill').filter(id=1).first()
            
            if id is not None:
                record = wtKlientBankTemp.objects.filter(id=id).first()

                if not record:
                    return send_warning(f"No loaded payment found with ID {id}", "Warning!")

                loaded_payment = {
                    "id": record.id,
                    "date": record.Date,
                    "num_doc": record.NumDoc,
                    "sum": record.Summa,
                    "status": {"id": status_obj.id, "name": status_obj.name},
                    "n_p": record.NaznP,
                    "client_name": "",
                    "address": "",
                    "client_payment_info": {
                        "client_name_id": None,
                        "city_id": None,
                        "street_id": None,
                        "house_id": None,
                        "room_id": None
                    }
                }

                return Response(loaded_payment, status=status.HTTP_200_OK)

            # If no ID is provided, fetch all records
            records = []
            total_sum = 0
            items = wtKlientBankTemp.objects.all()

            for record in items:
                records.append({
                    "id": record.id,
                    "date": record.Date,
                    "num_doc": record.NumDoc,
                    "sum": record.Summa,
                    "status": {"id": status_obj.id, "name": status_obj.name},
                    "n_p": record.NaznP,
                    "client_name": "",
                    "address": "",
                    "client_payment_info": {
                        "client_name_id": None,
                        "city_id": None,
                        "street_id": None,
                        "house_id": None,
                        "room_id": None
                    }
                })
                total_sum += record.Summa

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
                return send_warning("No loaded data!", "Warning!")
        except Exception as error:
            return send_error(error, "Error!")
