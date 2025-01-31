from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from api.helper.helper import send_error
from ..models import wtKlientBankTemp
from rest_framework import status
from django.http import JsonResponse
from api.helper.helper import NoDataToDelete

class CleanUploadedPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            if not wtKlientBankTemp.objects.exists():
                raise NoDataToDelete("No data to delete")
            wtKlientBankTemp.objects.all().delete()
            return JsonResponse({
                "success": {
                    "success_title": "Success!",
                    "success_message": "All data removed",
                }
            }, status=status.HTTP_200_OK)
        
        except NoDataToDelete as error:            
            return send_error(error, "Warning!")
        except Exception as error:
            return send_error(error, "Error!")
