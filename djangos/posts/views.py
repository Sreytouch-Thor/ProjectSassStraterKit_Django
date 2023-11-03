from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
import firebase_admin
from .models import Users
from firebase_admin import credentials
from firebase_admin import auth
from django.conf import settings
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