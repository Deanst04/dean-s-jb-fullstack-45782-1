from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView #login

from . import views

urlpatterns = [
    path("", views.index),
    path("hello", views.hello),
    path("index", views.index),
    path("test", views.test),
    path('login', TokenObtainPairView.as_view()),  # route
    path('register', views.register_user),
    path('pri_test', views.only_mem),
    path('private_username', views.private_user),
    path('add_image', views.add_image),
    path('my_images', views.display_user_images)
]
