from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import PaymentSaveSerializer
from django.db import connections
from ..models import wtKlientBankTemp
from rest_framework.permissions import IsAuthenticated


class SavePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = PaymentSaveSerializer(data=request.query_params)

        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        payment_id = serializer.validated_data["payment_id"]
        client_id = serializer.validated_data["client_id"]
        location_id = serializer.validated_data["location_id"]
        on_login = serializer.validated_data["on_login"]
        klientBank = wtKlientBankTemp.objects.filter(id=payment_id).first()        

        with connections['Bill'].cursor() as cursor:
            cursor.execute("EXEC CB_DetectService @naznp=%s, @client_id=%s, @location_id=%s, @on_login=%s", [klientBank.NaznP, client_id, location_id, on_login])
            service_id = cursor.fetchone()
            service_id = 0 if service_id is None else service_id[0]
            cursor.execute("EXEC CB_InsertKlientBank @mfo=%s, @dt=%s, @NumDoc=%s, @Summa=%s, @NameB=%s, @NaznP=%s, @service_id=%s, @username=%s",
                    [klientBank.MfoA, klientBank.Date, klientBank.NumDoc, klientBank.Summa, klientBank.NameB, klientBank.NaznP, service_id, request.user.username])
            result = cursor.fetchone()
            if result[0] == 0:
                return Response({"type": "error", "message": "Payment not saved"}, status=status.HTTP_200_OK)
            elif result[0] == -1:
                return Response({"type": "error", "message": "Payment already exists in Billing"}, status=status.HTTP_200_OK)
            wtKlientBankTemp.objects.filter(id=payment_id).first().delete()
            return Response({"type": "success", "message": "Payment saved successfully"}, status=status.HTTP_200_OK)