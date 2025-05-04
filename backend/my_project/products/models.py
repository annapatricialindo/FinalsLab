import random
from django.db import models
from django.core.exceptions import ValidationError
import colorsys

def hsl_to_hex(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return '#{:02X}{:02X}{:02X}'.format(int(r * 255), int(g * 255), int(b * 255))

def generate_vibrant_color_pair():
    h = random.random()  # random hue [0, 1]
    s = 0.9              # high saturation
    l = 0.6              # vibrant brightness

    primary = hsl_to_hex(h, s, l)

    # Slight hue shift for secondary (analogous), +20 degrees (~0.055)
    h2 = (h + random.uniform(0.04, 0.08)) % 1.0
    secondary = hsl_to_hex(h2, s, l)

    return primary, secondary

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    # For Design:
    genre = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(
        max_length=7,
        default="#007BFF", 
        help_text="Hex color code (e.g., #ff0066)"
    )
    visual_primary_color = models.CharField(
        max_length=7,
        default="#3399FF", 
        help_text="Hex color code"
    )
    visual_secondary_color = models.CharField(
        max_length=7,
        default="#003366",
        help_text="Hex color code"
    )

    def save(self, *args, **kwargs):
        if not self.visual_primary_color or self.visual_primary_color == "#3399FF":
            primary, secondary = generate_vibrant_color_pair()
            self.visual_primary_color = primary
            self.visual_secondary_color = secondary
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.order_items.exists():
            raise ValidationError("Cannot delete product that has already been ordered.")
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name
