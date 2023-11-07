from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
import firebase_admin
from .models import Users
from firebase_admin import credentials
from firebase_admin import auth
from django.conf import settings
# from .models import nanoid

from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Users
# from .email import send_email  # Assuming you have an email sending function
# Create your views here.


firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)

def getUsers(request):
    authorization_header =request.META.get('HTTP_AUTHORIZATION')
    print(authorization_header)
    users = Users.objects.all()
    response_object = {'data': serialize('json', users)}
    response_object['Access-Control-Allow-Origin'] = '*'
    return JsonResponse(response_object)



@csrf_exempt  # If you want to disable CSRF protection, you can use this decorator
def create_user(request):
    verify_key = request.POST.get('verify_key')

    # Verify the user by verify_key (your implementation may vary)
    try:
        user = Users.objects.get(verify_key=verify_key)
    except Users.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=400)

    username = user.username
    email = user.email

    # Perform your tasks here, e.g., save to email marketing and send a welcome email

    # Log in the user
    user.backend = 'django.contrib.auth.backends.ModelBackend'  # Set authentication backend
    login(request, user)

    return JsonResponse({
        'token': user.auth_token.key,  # Assuming you use Django Rest Framework for token authentication
        'user_id': user.id,
        'username': username,
        'email': email
    })

@csrf_exempt
def sign_up(request):
    token = request.POST.get('token')
    username = request.POST.get('username')
    email = request.POST.get('email')
    invite_key = request.POST.get('invite_key')
    is_invite_flow = request.POST.get('is_invite_flow')
    confirm_email_url = request.POST.get('confirm_email_url')

    # First, check if the user exists
    user_exists = Users.objects.filter(email=email).exists()

    if user_exists:
        return JsonResponse({'error': 'User already exists'}, status=400)

    # Decode the firebase token received from the frontend and save the firebase UUID
    # Your implementation may vary, and you may need to use a library like python-firebase
    # to interact with Firebase in Python.

    # Generate random bytes for user email verification
    # random_bytes = nanoid()

    # Send the verification email

    # Save user firebase info to our own db, and get a unique user database id

    return JsonResponse({'message': 'Email confirmation sent'})

@csrf_exempt
def login_user(request):
    token = request.POST.get('token')
    email = request.POST.get('email')

    # Perform token validation (your implementation may vary)

    # Authenticate the user
    user = authenticate(request, email=email)

    if user is not None:
        login(request, user)
        return JsonResponse({
            'token': user.auth_token.key, 
            'user_id': user.id
        })

    return JsonResponse({'error': 'User does not exist'}, status=400)

# Define similar views for updating username and email
