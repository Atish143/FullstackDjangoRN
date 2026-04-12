from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.models import Product


class CartItemProductSerializer(serializers.ModelSerializer):
    display_image = serializers.SerializerMethodField()

    class Meta:
        model  = Product
        fields = ['id', 'name', 'price', 'display_image', 'is_available']

    def get_display_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url


class CartItemSerializer(serializers.ModelSerializer):
    product  = CartItemProductSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model  = CartItem
        fields = ['id', 'product', 'quantity', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items      = CartItemSerializer(many=True, read_only=True)
    total      = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Cart
        fields = ['id', 'items', 'total', 'item_count', 'updated_at']


# Used for add-to-cart / update-quantity requests
class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity   = serializers.IntegerField(min_value=1, default=1)