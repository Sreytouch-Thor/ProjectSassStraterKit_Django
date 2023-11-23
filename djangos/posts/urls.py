from django.contrib import admin
from django.urls import path 
from . import views

urlpatterns = [
    path('signup', views.signUp),
    path('login', views.login),
    # path('signup/', views.signup),
    # path('signup', RedirectView.as_view(url='/auth/signup/')), 
    # path('login/', views.login),
    # path('create-user/', views.create_user, name='create_user'),
    # path('update-username/', views.update_username, name='update_username'),
    # path('update-email/', views.update_email, name='update_email'),
]
