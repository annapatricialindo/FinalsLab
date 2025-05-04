from django.urls import path
from .views import CartItemListCreateView, CheckoutView, OrderListView, OrderDetailView, OrderItemListView

urlpatterns = [
    # For customers
    path('cart/', CartItemListCreateView.as_view(), name='cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),

    # For employees
     path('orders/', OrderListView.as_view(), name='order-list'),
     path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
     path('orders/<int:order_id>/items/', OrderItemListView.as_view(), name='order-item-list'),
]
