from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserImageSerializer


@api_view(['GET'])
def hello(req):
  return Response('hello')

@api_view(['GET'])
def index(req):
    return Response("index")


@api_view(["GET"])
def test(req):
    return Response({"user_name": "dean", "age": 21})


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)

    return Response({"success": f"user {user.username} created"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def only_mem(req):
  user = req.user
  return Response({'Welcome': user.email})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def private_user(req):
  user = req.user
  return Response({'username': user.username})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_image(req):
  serializer = UserImageSerializer(data=req.data)

  if serializer.is_valid():
    serializer.save(user = req.user)

    return Response({
            "success": True,
            "message": "Image uploaded successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    
    # If validation fails, return errors
  return Response({
      "error": "Validation failed",
      "details": serializer.errors
  }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_user_images(req):

  user_images = req.user.images.all()

  serializer = UserImageSerializer(user_images, many=True)

  return Response({
        "success": True,
        "count": user_images.count(),
        "images": serializer.data
    }, status=status.HTTP_200_OK)
