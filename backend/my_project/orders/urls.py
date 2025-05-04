from django.urls import path
from .views import OrderListView, OrderDetailView, OrderItemListView

urlpatterns = [
    # For employees
     path('orders/', OrderListView.as_view(), name='order-list'),
     path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
     path('orders/<int:order_id>/items/', OrderItemListView.as_view(), name='order-item-list'),
]
