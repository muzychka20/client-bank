from rest_framework.views import APIView
from api.helper.helper import send_error


class DetectServiceView(APIView):
    def post(self, request):   
        return send_error("error", "Error!")
    