from django.db import models
from orders.models import Order

class CheckoutLog(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    processed_by = models.CharField(max_length=255)
    processed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Checkout log for Order #{self.order.id}"
