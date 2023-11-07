from django.contrib import admin
from django.urls import path
from .import views

urlpatterns = [
    path('getUsers/', views.getUsers),
    path('signup/', views.sign_up, name='sign_up'),
    path('login/', views.login_user, name='login_user'),
    path('create-user/', views.create_user, name='create_user'),
    # path('update-username/', views.update_username, name='update_username'),
    # path('update-email/', views.update_email, name='update_email'),
]
