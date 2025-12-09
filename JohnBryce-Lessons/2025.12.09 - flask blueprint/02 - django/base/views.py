from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def hello(req):
  return Response('hello')

@api_view(['GET'])
def index(req):
  return Response('index')
