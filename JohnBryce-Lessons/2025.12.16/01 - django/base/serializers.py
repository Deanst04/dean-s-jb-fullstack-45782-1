from rest_framework import serializers
from .models import UserImages

class UserImageSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = UserImages
        fields = ['id', 'user', 'image']