from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from products.models import Product

class Order(models.Model):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_checked_out = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} by {self.customer.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
    quantity = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if self.quantity > self.product.stock:
            raise ValidationError("Not enough stock for this product.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if self.product.stock == 0:
            raise ValidationError("Cannot add to cart: product is out of stock.")
        if self.quantity > self.product.stock:
            raise ValidationError("Not enough stock available.")
        super().save(*args, **kwargs)
