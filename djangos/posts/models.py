from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

# Create your models here.

class Users(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    firebase_user_id = models.CharField(max_length=255)
    verify_key = models.CharField(max_length=255)
    is_email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    

class Organizations(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org_name = models.CharField(max_length=255)
    primary_email = models.ForeignKey(Users, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=255)
    subscription_id = models.CharField(max_length=255)
    plan_type = models.CharField(max_length=255)


class Roles(models.Model):
    org_id = models.ForeignKey(Organizations, on_delete=models.CASCADE)
    user_id = models.ForeignKey(Users, on_delete=models.CASCADE)
    role = models.CharField(max_length=255)


class Todos(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=1000)
    author = models.CharField(max_length=255)
    org_id = models.ForeignKey(Organizations, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    date = models.DateField()


class Invites(models.Model):
    org_id = models.ForeignKey(Organizations, on_delete=models.CASCADE)
    verify_key = models.CharField(max_length=255)
    recipient_email = models.EmailField()
    sender_email = models.EmailField()

