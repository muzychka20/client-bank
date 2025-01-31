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


def send_warning(warning, type):
    warning_message = f"{str(warning)}"
    return JsonResponse({
        "warning": {
            "warning_title": type,
            "warning_message": warning_message,
        }
    }, status=status.HTTP_200_OK)
