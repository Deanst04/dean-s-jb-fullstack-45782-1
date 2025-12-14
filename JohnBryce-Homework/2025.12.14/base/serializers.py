from django.contrib.auth.models import User
from rest_framework import fields, serializers
from .models import UserImages

class UserImageSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = UserImages
        fields = ['id', 'user', 'image']

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'username', 'email', 'first_name', 'last_name']
    