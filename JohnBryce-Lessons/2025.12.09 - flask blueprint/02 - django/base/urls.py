from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView #login

from . import views

urlpatterns = [
    path("", views.index),
    path("hello", views.hello),
    path("index", views.index),
    path("test", views.test),
    path('login', TokenObtainPairView.as_view()),  # route
    path('register', views.addUser),
    ]
