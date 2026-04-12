from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryListView(generics.ListAPIView):
    queryset         = Category.objects.all()
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    queryset         = Product.objects.filter(is_available=True).select_related('category')
    serializer_class = ProductSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields    = ['name', 'description', 'category__name']
    ordering_fields  = ['price', 'rating', 'created_at']


class ProductDetailView(generics.RetrieveAPIView):
    queryset         = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer


class FeaturedProductListView(generics.ListAPIView):
    queryset         = Product.objects.filter(is_available=True, is_featured=True)
    serializer_class = ProductSerializer