from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            # 'firebase_user_id': {'required': False},
            'verify_key': {'required': False},         
            }
        
    def create(self, validated_data):
        user = Users(
            username=validated_data['username'],
            email=validated_data['email'],
            firebase_user_id=validated_data['firebase_user_id'],
            # verify_key=validated_data['verify_key'],
            
        )
        user.save()
        return user