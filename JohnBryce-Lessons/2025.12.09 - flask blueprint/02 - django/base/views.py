from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def hello(req):
  return JsonResponse('hello...', safe=False)

def index(req):
  return JsonResponse('index...', safe=False)
