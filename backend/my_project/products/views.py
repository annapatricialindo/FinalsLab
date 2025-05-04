from rest_framework import generics
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Product
from .serializers import ProductSerializer
from accounts.permissions import IsAnyUser, IsAdminOrEmployee

class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAnyUser()] 
        return [IsAdminOrEmployee()]  

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAnyUser]

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except DjangoValidationError as e:
            raise DRFValidationError({'detail': str(e)})
        
class ProductSearchView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        return Product.objects.filter(name__icontains=query)
