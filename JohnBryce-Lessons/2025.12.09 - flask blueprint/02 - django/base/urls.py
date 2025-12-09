from django.urls import path

from . import views

urlpatterns = [
    path("", views.index),
    path("hello", views.hello),
    path("index", views.index),
    path("test", views.test),
]
