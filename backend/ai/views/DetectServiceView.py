from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.helper.helper import send_error
from ..model.detection.ModelAI import ModelAI
from ..model.detection.ServiceDetection import ServiceDetection
from api.models import wtKlientBankTemp
from django.db import transaction


class DetectServiceView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.model = None
        self.service_detection = None

    def initialize_models(self):
        if not self.model or not self.service_detection:
            try:
                self.model = ModelAI()
                self.service_detection = ServiceDetection(self.model)
            except Exception as e:
                print("Error: ", e)
                raise

    def process_single_naznp(self, record):
        try:
            service_id = self.service_detection.detect_service(record.NaznP)
            if service_id:
                record.service_id = service_id
                record.service_old = service_id
                record.status = 6
                record.save()
            return {
                "id": record.id,
                "naznp": record.NaznP,
                "service_id": service_id,
                "status": "success"
            }
        except Exception as e:
            return {
                "id": record.id,
                "naznp": record.NaznP,
                "service_id": 0,
                "status": f"error: {str(e)}"
            }

    def post(self, request):
        try:
            self.initialize_models()

            records = wtKlientBankTemp.objects.all()
            
            if not records.exists():
                return Response({
                    "status": "success",
                    "message": "No records to process",
                    "data": []
                }, status=status.HTTP_200_OK)

            results = []
            success_count = 0
            error_count = 0

            with transaction.atomic():
                for record in records:
                    result = self.process_single_naznp(record)
                    results.append(result)
                    if result["status"] == "success":
                        success_count += 1
                    else:
                        error_count += 1

            response_data = {
                "status": "success",
                "message": "Processing completed",
                "data": {
                    "total_processed": len(results),
                    "success_count": success_count,
                    "error_count": error_count,
                    "results": results
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return send_error("error", f"Service detection failed: {str(e)}")
