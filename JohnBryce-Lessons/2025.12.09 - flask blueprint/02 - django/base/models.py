from django.db import models

# Create your models here.


class Categories(models.Model):
    name = models.CharField(max_length=40, unique=True)
    desc = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name


class Products(models.Model):
    categories = models.ForeignKey(
        Categories, on_delete=models.CASCADE, null=True, blank=True
    )
    desc = models.CharField(max_length=50, null=True, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    createdTime = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(null=True, blank=True, default="/placeholder.png")

    def __str__(self):
        return f"{self.desc} {self.price}"
