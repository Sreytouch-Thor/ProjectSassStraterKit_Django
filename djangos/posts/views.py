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
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from .utils import generate_random_bytes ,get_user, set_token
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
                 # Generate random bytes for user email verify
                random_bytes = generate_random_bytes(20)
                confirm_email_url = f"{"http://localhost:3000/auth/confirmedemail"}/?key={random_bytes}"

                # Create a new user instance with firebase_user_id
                user_data = {
                    'username': request.data.get('username'),
                    'email': request.data.get('email'),
                    'firebase_user_id': firebase_user_id,
                    'verify_key': random_bytes,
                    # 'is_email_verified' : confirm_email_url,
                }
                serializer = UserSerializer(data=user_data)
                print(serializer)

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



@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        token = request.data.get('token')
        email = request.data.get('email')
        # print("token : ", token)
        # print("email: ", email)
        # if token:
        try:
            # Decode the Firebase token received from the frontend
            decoded_token = auth.verify_id_token(token)
            firebase_user_id = decoded_token['user_id']
            # print("Decoded Token:", decoded_token)

            # user_id = get_user(email).id
            # print("firebase_user_id :" , firebase_user_id)
            # print("user_id :" , user_id)
            # return Response({'token': set_token(user_id)})
        # except Exception as e:
        #     return Response({'error': str(e)}, status=500)          
        except auth.AuthError as e:
            return Response({'type': 'Failed Login', 'message': f'Firebase Authentication Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the user exists in your Django database
        try:
            user_profile = Users.objects.get(email=email)
            print('user_profile : ', user_profile)
        except Users.DoesNotExist:
            # If the user is not found, you might choose to return an error
            return Response({'type': 'Failed Login', 'message': 'User Does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify if the Firebase user ID matches the stored user ID
        if user_profile:
            print(f"Firebase User ID: {firebase_user_id}, User Profile ID: {user_profile.id}")
            return Response({'type': 'Failed Login', 'message': 'Invalid Firebase User ID'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a token or return any other relevant information
        # For simplicity, let's assume you have a function set_token.
        token = set_token(user_profile.id)
        print('token set : ', token)
        serialized_user_profile = UserSerializer(user_profile).data
        print('serialized_user_profile  : ', serialized_user_profile)

        return Response({'token': token, 'user_profile': serialized_user_profile}, status=status.HTTP_200_OK)

            # if user is not None:
            #     login(request, user)
            #     return JsonResponse({
            #         'token': user.auth_token.key, 
            #         'user_id': user.id
            #     })

            # return JsonResponse({'error': 'User does not exist'}, status=400)
        # except jwt.ExpiredSignatureError:
        #     return JsonResponse({'error': 'Token has expired'}, status=400)
        # except jwt.InvalidTokenError:
        #     return JsonResponse({'error': 'Invalid token'}, status=400)
    # return JsonResponse({'error': 'do not have token '}, status=400)
# # Define similar views for updating username and email
