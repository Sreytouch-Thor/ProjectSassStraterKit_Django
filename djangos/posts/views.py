# from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
import firebase_admin
from .models import *
from firebase_admin import credentials
from firebase_admin import auth
from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login ,logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer,OrganizationsSerializer, RolesSerializer
from .utils import generate_random_bytes , set_token, create_org_model, create_stripe_customer, set_org_stripe_id, create_org_role, get_org_model
import jwt

# from .email import send_email  # Assuming you have an email sending function
# Create your views here.


firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)

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
        try:
            # Decode the Firebase token received from the frontend
            decoded_token = auth.verify_id_token(token)
            firebase_user_id = decoded_token['user_id']
            # print("Decoded Token:", decoded_token)
       
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
        if not user_profile:
            print("Firebase User ID: {firebase_user_id}, User Profile ID: {user_profile.id}")
            return Response({'type': 'Failed Login', 'message': 'Invalid Firebase User ID'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a token or return any other relevant information
        # Convert UUID to string before including it in the response
        user_profile_id_str = str(user_profile.id)
        print('user_profile_id_str  : ', user_profile_id_str)

        # For simplicity, let's assume you have a function set_token.
        token = set_token(user_profile.id)
        print('token set : ', token)
        serialized_user_profile = UserSerializer(user_profile).data
        print('serialized_user_profile  : ', serialized_user_profile)

        return Response({'token': token, 'user_profile': serialized_user_profile, 'user_profile_id': user_profile_id_str}, status=status.HTTP_200_OK)


@api_view(['POST'])
def CreateOrg(request):
    if request.method == 'POST':
        primary_email = request.data.get('email')
        org_name = request.data.get('org_name')
        user_id = request.data.get('user_id')
        role = request.data.get('role')

        try:
            # Retrieve the user instance
            user_instance = Users.objects.get(email=primary_email)
            user_profile_id_str = str(user_instance.id)

            # Create the organization and other related entities
            org_id = create_org_model(primary_email, org_name)
            stripe_id = create_stripe_customer(primary_email, user_instance.id, org_id)
            set_org_stripe_id(stripe_id.id, org_id)

            # Create the role using the user instance
            create_org_role(org_id, user_profile_id_str, role)

            return Response({'message': 'Org Created'}, status=200)

        except Users.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=400)

    else:
        return Response({'error': 'Invalid request method'}, status=400)

@api_view(['GET'])
def get_orgs(request):
    user_id = request.query_params.get('user_id')
    print('userid: ',user_id)

    try:
        result = get_org_model(user_id.id)
        return Response(result, status=200)
    except Exception as e:
        return Response({'error': f'Error retrieving organizations: {e}'}, status=500)

# @api_view(['POST'])
# def create_role(request):
#     if request.method == 'POST':
#         serializer = RolesSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)