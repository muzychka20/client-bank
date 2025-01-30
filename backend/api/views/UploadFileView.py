from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from dbfread import DBF
from datetime import datetime


class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES["file"]
        file_path = default_storage.save(f"uploads/{file.name}", file)
        records = []

        with DBF(file_path, encoding='cp866') as table:
            for record in table:
                print(record)
                records.append({
                    # "date": datetime.strptime(record["DATE"], '%Y-%m-%d %H:%M:%S.%f').strftime("%d.%m.%Y"),
                    "date": record["DATE"],
                    "num_doc": record["NUM_DOC"],
                    "sum": record["SUM"],
                    "status": "в обработке",
                    "n_p": record["N_P"],
                    "client_name": "",
                    "address": "",
                })

        return Response({'records': records, }, status=status.HTTP_200_OK)
