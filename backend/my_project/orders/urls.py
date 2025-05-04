from django.urls import path
from .views import CartItemListCreateView, CheckoutView, OrderListView, OrderDetailView, OrderItemListView, CartItemDeleteView, CartItemUpdateView, CartItemClearView, CustomerOrderDetailView

urlpatterns = [
 path('orders/', OrderListView.as_view(), name='order-list'),
     path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
     path('orders/<int:order_id>/items/', OrderItemListView.as_view(), name='order-item-list'),
]
