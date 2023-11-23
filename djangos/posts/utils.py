# utils.py
import secrets
# users/utils.py
from .models import Users
# views.py
import jwt
from datetime import datetime, timedelta
from django.conf import settings


def generate_random_bytes(length=32):
    """Generate random bytes as a hexadecimal string."""
    return secrets.token_hex(length)


def get_user(email):
    try:
        user = Users.objects.get(email=email)
        print(user)
        return user
    except Users.DoesNotExist:
        return None
    

# Your existing code...

def set_token(user_profile_id):
    # Define the payload for the JWT
    payload = {
        'user_id': user_profile_id,
        'exp': datetime.utcnow() + timedelta(days=1),  # Token expiration time
        'iat': datetime.utcnow()  # Token issued at time
    }

    # Create the JWT token
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    return token.decode('utf-8')
