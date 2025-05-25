from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import wtKlientBankTemp
from django.db import connections
from api.helper.helper import send_error
from api.helper.helper import send_warning


class TransferPaymentView(APIView):
     def post(self, request):
        try:
            records = wtKlientBankTemp.objects.filter(status=6)
            success_count = 0
            error_count = 0
            already_exists_count = 0

            with connections['Bill'].cursor() as cursor:
                for record in records:                    
                    cursor.execute(
                        "EXEC CB_InsertKlientBank @mfo=%s, @dt=%s, @NumDoc=%s, @Summa=%s, @NameB=%s, @NaznP=%s, @service_id=%s, @username=%s",
                        [record.MfoA, record.Date, record.NumDoc, record.Summa, record.NameB, record.NaznP, record.service_id, request.user.username]
                    )
                    result = cursor.fetchone()

                    if result[0] == 1:
                        success_count += 1
                        record.delete()
                    elif result[0] == -1:
                        already_exists_count += 1
                        record.delete()
                    else:
                        error_count += 1

            total_processed = success_count + error_count + already_exists_count
            
            if total_processed == 0:
                return send_warning("No payments with status `оброблено` found", "Warning!")

            return Response({
                "success": True,
                "message": f"Processed {total_processed} payments: {success_count} saved successfully, {already_exists_count} already existed, {error_count} failed"
            }, status=status.HTTP_200_OK)

        except Exception as error:
            return send_error(error, "Error processing payments!")