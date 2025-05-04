from django.urls import path
from .views import CartItemListCreateView, CheckoutView, OrderListView, OrderDetailView, OrderItemListView, CartItemDeleteView, CartItemUpdateView, CartItemClearView, CustomerOrderDetailView

urlpatterns = [
    # For customers
    path('cart/', CartItemListCreateView.as_view(), name='cart'),
    path('cart/<int:pk>/', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('cart/<int:pk>/update/', CartItemUpdateView.as_view(), name='cart-item-update'),
    path('cart/clear/', CartItemClearView.as_view(), name='cart-clear'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('orders/<int:pk>/', CustomerOrderDetailView.as_view(), name='order-detail'),

    # For employees
     path('orders/', OrderListView.as_view(), name='order-list'),
     path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
     path('orders/<int:order_id>/items/', OrderItemListView.as_view(), name='order-item-list'),
]
