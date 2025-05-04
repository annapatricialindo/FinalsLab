from django.urls import path
from .views import TransactionTestView

urlpatterns = [
    path('', TransactionTestView.as_view(), name='transactions'),
]
