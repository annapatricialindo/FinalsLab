from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import CartItem, Cart, Order, OrderItem
from .serializers import CartItemSerializer, OrderSerializer, OrderItemSerializer
from accounts.permissions import IsCustomer, IsAdminOrEmployee

# Add to cart


# List all checkouts
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrEmployee]

    def get_queryset(self):
        # Fetch orders based on the date filter (if provided)
        queryset = Order.objects.all()

        # Filter by date if provided in query params
        date_from = self.request.query_params.get('from', None)
        date_to = self.request.query_params.get('to', None)
        
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)

        return queryset

# View order details
class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrEmployee]



# List order items (details of a checkout)
class OrderItemListView(generics.ListAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAdminOrEmployee]

    def get_queryset(self):
        order_id = self.kwargs['order_id']
        return OrderItem.objects.filter(order__id=order_id)
