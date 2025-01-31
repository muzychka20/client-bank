from django.http import JsonResponse
from rest_framework import status


def send_error(error, type):
    error_message = f"{str(error)}"
    return JsonResponse({
        "error": {
            "error_title": type,
            "error_message": error_message,
        }
    }, status=status.HTTP_400_BAD_REQUEST)

class NoDataToDelete(ValueError):
    pass

class NoNewDataException(ValueError):
    pass
