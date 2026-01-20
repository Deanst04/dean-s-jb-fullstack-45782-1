from django.conf import settings
from django.http import JsonResponse
from django.urls import path
import requests
import socket

settings.configure(
    DEBUG=True,
    ROOT_URLCONF=__name__,
    SECRET_KEY='dev-secret-key',
    ALLOWED_HOSTS=['*'],
)

def home(request):
    return JsonResponse({
        "service": "Django",
        "hostname": socket.gethostname(),
        "message": "Hello from Django!"
    })

def call_fastapi(request):
    try:
        response = requests.get("http://fastapi-service/")
        fastapi_data = response.json()
        
        return JsonResponse({
            "django_hostname": socket.gethostname(),
            "message": "Django called FastAPI successfully!",
            "fastapi_response": fastapi_data
        })
    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)

urlpatterns = [
    path('', home),
    path('call-fastapi/', call_fastapi),
]

if __name__ == "__main__":
    from django.core.management import execute_from_command_line
    execute_from_command_line(["manage", "runserver", "0.0.0.0:8000"])
