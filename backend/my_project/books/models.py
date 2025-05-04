from django.db import models
from django.utils import timezone

class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Book(models.Model):
    # String-based fields
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    
    # Date fields
    published_date = models.DateField()

     # Integer field with a default value
    page_count = models.IntegerField(default=100)  # Default number of pages set to 100
    
    # Float field with a default value
    price = models.FloatField(default=1.00)  # Default price set to 9.99

    # Text field for longer descriptions
    description = models.TextField(default="No description provided.")

    # Boolean field to indicate if the book is available
    is_available = models.BooleanField(default=True)

    # DateTime field for when the book was added to the system
    # added_on = models.DateTimeField(auto_now_add=True)

    # # Image field (if you want to store book cover images)
    # cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)

    # # Many-to-many relationship for selecting genres
    # genres = models.ManyToManyField(Genre, related_name='books')

    def __str__(self):
        return self.title
