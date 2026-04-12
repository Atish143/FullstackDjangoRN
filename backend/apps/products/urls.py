from django.urls import path
from .views import CategoryListView, ProductListView, ProductDetailView, FeaturedProductListView

urlpatterns = [
    path('',              ProductListView.as_view(),        name='product-list'),
    path('<int:pk>/',     ProductDetailView.as_view(),      name='product-detail'),
    path('categories/',   CategoryListView.as_view(),       name='category-list'),
    path('featured/',     FeaturedProductListView.as_view(),name='featured-products'),
]