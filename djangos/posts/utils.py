# utils.py
import secrets
import stripe
from django.http import JsonResponse
# users/utils.py
from .models import *
# views.py
import jwt
from datetime import datetime, timedelta
from django.conf import settings
# Import the uuid module
import uuid
from django.core.exceptions import ObjectDoesNotExist


def generate_random_bytes(length=32):
    """Generate random bytes as a hexadecimal string."""
    return secrets.token_hex(length)


def set_token(user_id):
    # Convert UUID to string before encoding
    user_id_str = str(user_id)   
    # Payload creation and token encoding
    payload = {'user_id': user_id_str}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
    return token

#=========Org and Role========

def create_org_model(primary_email, org_name):
    # Get the user instance based on the email
    user_instance, created = Users.objects.get_or_create(email=primary_email)
    
    # Create the organization model
    org_instance = Organizations.objects.create(primary_email=user_instance, org_name=org_name)
    
    return org_instance.id


stripe.api_key = 'sk_test_51NmpgzIJD6PdyPKnZBkaJ3Hp8JCnKZlvIsFqFLOkLx3h5mv2TYmhBPiv9pxCzuAm8ErXrM28ym7TbxmL1jC6sFRs00YdmMU4oZ'  # Replace with your actual Stripe secret key

def create_stripe_customer(email, user_id, org_id):
    try:
        # Create a Stripe customer
        customer = stripe.Customer.create(
            email=email,
            metadata={
                'org_id': org_id,
                'user_id': user_id
            }
        )
        return customer
    except stripe.error.StripeError as e:
        return {'error': str(e)}
    

def set_org_stripe_id(stripe_id, org_id):
    org_instance = Organizations.objects.get(id=org_id)
    org_instance.stripe_customer_id = stripe_id
    org_instance.save()


def create_org_role(org_id, user_id, role):
    try:
        # Retrieve the Organizations instance based on org_id
        organization = Organizations.objects.get(id=org_id)
        try:
            # Retrieve the Users instance based on user_id
            user_profile = Users.objects.get(id=user_id)
            user_id = user_profile.id  # Use the user ID directly
            print('user_id role:', user_id)
        except ObjectDoesNotExist:
            print(f"User with id {user_id} does not exist.")

        print("organization:", organization) 
        Roles.objects.create(org_id=organization, user_id=user_id, role=role)
    except Organizations.DoesNotExist:
        print(f"Organization with id {org_id} does not exist.")
    except Exception as e:
        # Handle other exceptions if needed
        print(f"Error creating role: {e}")

def get_org_model(user_id):
    user_id = str(user_id)   
    # Payload creation and token encoding
    payload = {'user_id': user_id}
    result = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
    return result