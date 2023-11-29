from rest_framework import serializers
from .models import *
import uuid

class UserSerializer(serializers.ModelSerializer):
    user_profile_id = serializers.SerializerMethodField()
    class Meta:
        model = Users
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            # 'firebase_user_id': {'required': False},
            # 'verify_key': {'required': False},         
            }
        
    def create(self, validated_data):
        user = Users(
            username=validated_data['username'],
            email=validated_data['email'],
            firebase_user_id=validated_data['firebase_user_id'],
            verify_key=validated_data.get('verify_key',''),
            # is_email_verified=validated_data.get('is_email_verified')
            
        )
        user.save()
        return user
    
    def get_user_profile_id(self, obj):
        return str(obj.id)
    

class OrganizationsSerializer(serializers.ModelSerializer):
    primary_email = UserSerializer()

    class Meta:
        model = Organizations
        fields = '__all__'


class RolesSerializer(serializers.ModelSerializer):
    org_id = OrganizationsSerializer()
    user_id = UserSerializer()

    class Meta:
        model = Roles
        fields = '__all__' 
