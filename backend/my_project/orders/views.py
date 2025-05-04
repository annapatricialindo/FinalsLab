from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import CartItem, Cart, Order, OrderItem
from .serializers import CartItemSerializer, OrderSerializer, OrderItemSerializer
from accounts.permissions import IsCustomer, IsAdminOrEmployee

# Add to cart
class CartItemListCreateView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def perform_create(self, serializer):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        serializer.save(cart=cart)

# Checkout
class CheckoutView(APIView):
    permission_classes = [IsCustomer]

    def post(self, request):
        user = request.user
        cart, created = Cart.objects.get_or_create(user=user)
        items = cart.items.select_related('product')

        if not items.exists():
            return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            order = Order.objects.create(customer=user, is_checked_out=True)

            for item in items:
                if item.quantity > item.product.stock:
                    return Response(
                        {'detail': f'Not enough stock for {item.product.name}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity)
                item.product.stock -= item.quantity
                item.product.save()

            # Clear the cart
            items.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

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