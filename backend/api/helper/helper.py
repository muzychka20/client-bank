from django.http import JsonResponse
from rest_framework import status
from datetime import datetime


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


def parse_date(record):
    date_str = record.get("DATE", "") if record.get(
        "DATE", "") else record["DATA"]

    try:
        # Если строка в формате 'YYYY-MM-DD HH:MM:SS.s'
        return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S.%f")
    except ValueError:
        pass

    try:
        # Если строка в формате 'YYYYMMDD'
        return datetime.strptime(date_str, "%Y%m%d")
    except ValueError:
        pass

    try:
        # Если строка в формате 'DD.MM.YYYY'
        return datetime.strptime(date_str, "%d.%m.%Y")
    except ValueError:
        pass

    # Ошибка, если дата не подошла ни под один формат
    raise ValueError(f"Неизвестный формат даты: {date_str}")
