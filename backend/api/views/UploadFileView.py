from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from dbfread import DBF
from api.helper.helper import send_error, send_warning, parse_date
from ..models import wtKlientBankTemp


class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            file = request.FILES["file"]

            file_path = default_storage.save(f"uploads/{file.name}", file)
            records = []

            with DBF(file_path, encoding='cp866') as table:
                for record in table:
                    print(record)

                    date = parse_date(record)                    
                    num_doc = record.get("NUM_DOC", "") if record.get("NUM_DOC", "") else record.get(
                        "N_D", "") if record.get("N_D", "") else record["ND"]
                    sum = record.get("SUM", "") if record.get("SUM", "") else record.get(
                        "SUMMA", "") if record.get("SUMMA", "") else record["S"]
                    n_p = record["N_P"]
                    mfo_a = record["MFO_A"]

                    if not wtKlientBankTemp.objects.filter(NumDoc=num_doc, Summa=sum).exists():
                        r = wtKlientBankTemp(
                            NumDoc=num_doc, Date=date, Summa=sum, MfoA=mfo_a, NaznP=n_p, service_old=0)
                        r.save()

                        records.append({
                            "date": date,
                            "num_doc": num_doc,
                            "sum": sum,
                            "status": 0,
                            "n_p": n_p,
                            "client_name": "",
                            "address": "",
                        })

            if records:
                return Response({'records': records, }, status=status.HTTP_200_OK)
            else:
                return send_warning("No new data!", "Warning!")

        except Exception as error:
            return send_error(error, "Error!")
