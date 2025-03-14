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

            if service_id:
                cursor.execute("EXEC CB_InsertKlientBank @mfo=%s, @dt=%s, @NumDoc=%s, @Summa=%s, @NameB=%s, @NaznP=%s, @username=%s",
                    [klientBank.MfoA, klientBank.Date, klientBank.NumDoc, klientBank.Summa, klientBank.NameB, klientBank.NaznP, request.user.username])

        wtKlientBankTemp.objects.filter(id=payment_id).first().delete()

        return Response({"service_id": service_id[0] if service_id else 0}, status=status.HTTP_200_OK)