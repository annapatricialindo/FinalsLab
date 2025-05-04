from django.urls import path
from .views import OrderTestView

urlpatterns = [
    path('', OrderTestView.as_view(), name='orders'),
]
