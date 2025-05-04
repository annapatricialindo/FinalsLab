from django.urls import path
from .views import ProductListCreate, ProductDetail, ProductSearchView

urlpatterns = [
    path('', ProductListCreate.as_view(), name='product-list-create'),
    path('<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('search/', ProductSearchView.as_view(), name='product-search'),
]
