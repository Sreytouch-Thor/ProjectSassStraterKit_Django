# from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
import firebase_admin
from .models import Users
from firebase_admin import credentials
from firebase_admin import auth
from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login ,logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from rest_framework.authtoken.models import Token
import jwt
# from .email import send_email  # Assuming you have an email sending function
# Create your views here.


firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)

# @api_view(['GET'])
# def signUp(request):
    
#     authorization_header =request.META.get('HTTP_AUTHORIZATION')
#     print(authorization_header)
#     users = Users.objects.all()
#     response_object = {'data': serialize('json', users)}
#     response_object['Access-Control-Allow-Origin'] = '*'
#     return JsonResponse(response_object)


@api_view(['POST'])
def signUp(request):
    if request.method == 'POST':
        token = request.data.get('token')
        if token:
            try:             
                decoded_token = auth.verify_id_token(token)
                firebase_user_id =decoded_token['user_id']
                # Create a new user instance with firebase_user_id
                user_data = {
                    'username': request.data.get('username'),
                    'email': request.data.get('email'),
                    'firebase_user_id': firebase_user_id,
                }
                serializer = UserSerializer(data=user_data)
                print(serializer)
                print(serializer.is_valid())
                if serializer.is_valid():
                    # Save the user to the database
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)     
                else:
                    # Print or log the errors for debugging
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token has expired'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid token'}, status=400)
        return JsonResponse({'error': 'do not hae token '}, status=400)



# @api_view(['POST'])
# def signUp(request):
#     if request.method == 'POST':
#         # token = request.data.get('token')
#         token = request.GET.get('token')

#     if not token:
#         return JsonResponse({'error': 'Token is required'}, status=400)

#     try:
#         decoded_token = jwt.decode(token, 'your-secret-key', algorithms=['HS256'])
#         # Assuming 'your-secret-key' is the same key used to encode the token

#         # Extract user information from the decoded token
#         username = decoded_token.get('username')
#         email = decoded_token.get('email')
#         firebase_user_id = decoded_token.get('user_id')
#         password = decoded_token.get('password')
#         user = authenticate(request, username= username, email= email, password = password, firebase_user_id= firebase_user_id)
#         serializer = UserSerializer(data=request.data) 
 
#         if serializer.is_valid():
#             username= username
#             email=email
#             firebase_user_id
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @csrf_exempt
# def login_user(request):
#     token = request.POST.get('token')
#     email = request.POST.get('email')

#     # Perform token validation (your implementation may vary)

#     # Authenticate the user
#     user = authenticate(request, email=email)

#     if user is not None:
#         login(request, user)
#         return JsonResponse({
#             'token': user.auth_token.key, 
#             'user_id': user.id
#         })

#     return JsonResponse({'error': 'User does not exist'}, status=400)

# # Define similar views for updating username and email
