from django.db import models
from django.core.exceptions import ValidationError

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def delete(self, *args, **kwargs):
        if self.order_items.exists():
            raise ValidationError("Cannot delete product that has already been ordered.")
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name
