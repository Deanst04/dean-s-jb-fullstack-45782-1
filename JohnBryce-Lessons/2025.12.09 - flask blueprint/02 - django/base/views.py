from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User


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
def addUser(request):
    # Get data from request body
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validate that all fields are provided
    if not all([username, email, password]):
        return Response(
            {"error": "Please provide username, email, and password"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if user already exists
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create the user
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        return Response(
            {"success": "User created successfully", "user_id": user.id},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
