from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
from .models import Users
# Create your views here.

def getUsers(request):
    users = Users.objects.all()
    response_object = {'data': serialize('json', users)}
    return JsonResponse(response_object)