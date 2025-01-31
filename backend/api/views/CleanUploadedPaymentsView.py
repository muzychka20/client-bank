from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from ..models import wtKlientBankTemp
from rest_framework import status
from django.http import JsonResponse
from api.helper.helper import send_error, send_warning


class CleanUploadedPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            if not wtKlientBankTemp.objects.exists():
                return send_warning("No loaded data to delete!", "Warning!")

            wtKlientBankTemp.objects.all().delete()
            return JsonResponse({
                "success": {
                    "success_title": "Success!",
                    "success_message": "All data removed",
                }
            }, status=status.HTTP_200_OK)
        except Exception as error:
            return send_error(error, "Error!")
