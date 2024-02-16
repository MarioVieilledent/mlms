from django.conf import settings
from django.urls import path
from django.core.handlers.wsgi import WSGIHandler
from django.http import JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
import json

# Settings for CORS
settings.configure(
    DEBUG=True,
    ALLOWED_HOSTS=['*'],  # Allowing all hosts, change in production
    CORS_ORIGIN_ALLOW_ALL=True,
    CORS_ALLOW_CREDENTIALS=True,
)

# Mock database for storing messages
messages = [
    {"id": "1", "data": "Hello World!", "color": "blue"},
    {"id": "2", "data": "This is a test message.", "color": "green"},
]

# Define views for API endpoints
@csrf_exempt
def get_messages(request):
    if request.method == 'GET':
        return JsonResponse(messages, safe=False)

@csrf_exempt
def post_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            id = str(len(messages) + 1)
            message = {"id": id, "data": data["data"], "color": data["color"]}
            messages.append(message)
            return JsonResponse({"message": "ok"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def update_message(request, id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            for message in messages:
                if message["id"] == id:
                    message["data"] = data["data"]
                    message["color"] = data["color"]
                    return JsonResponse({"message": "ok"})
            return JsonResponse({"error": "Message not found"}, status=404)
        except ObjectDoesNotExist:
            return JsonResponse({"error": "Message not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

# Define URL patterns
urlpatterns = [
    path('message', get_messages),
    path('message', post_message),
    path('message/<str:id>', update_message),
]

# Start the server
if __name__ == "__main__":
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'runserver', 'localhost:4003'])