from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.helper.helper import send_error, send_warning
from ..models import wtKlientBankTemp, refKlientBankStatus
from django.db import connections


class LoadedPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        try:            
            if id is not None:
                record = wtKlientBankTemp.objects.filter(id=id).first()
                status_obj = refKlientBankStatus.objects.using('Bill').filter(id=record.status).first()

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
                
                if record.service_id:
                    with connections['Bill'].cursor() as cursor:
                        cursor.execute("exec CB_GetAddressByService %s", [record.service_id])
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

                    loaded_payment['client_payment_info'] = client_payment_info

                return Response(loaded_payment, status=status.HTTP_200_OK)

            # If no ID is provided, fetch all records
            records = []
            total_sum = 0
            items = wtKlientBankTemp.objects.all()

            for record in items:
                status_obj = refKlientBankStatus.objects.using('Bill').filter(id=record.status).first()
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
                return Response(
                    {
                        'records': records,
                        'total_count': len(records),
                        'total_sum': total_sum
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return send_warning("No loaded data!", "Warning!")
        except Exception as error:
            return send_error(error, "Error!")
