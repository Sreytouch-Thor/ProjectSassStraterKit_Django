from django.contrib import admin
from django.urls import path
from .views import getUsers

urlpatterns = [
    path('', getUsers),
]
