from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'icon', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ['name', 'category', 'price', 'rating', 'is_available', 'is_featured']
    list_filter    = ['category', 'is_available', 'is_featured']
    search_fields  = ['name', 'description']
    list_editable  = ['price', 'is_available', 'is_featured']