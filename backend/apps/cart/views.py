from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer
from apps.products.models import Product


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get current user's cart."""
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Add item to cart or increase quantity if already exists."""
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        quantity   = serializer.validated_data['quantity']

        try:
            product = Product.objects.get(id=product_id, is_available=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        cart = get_or_create_cart(request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        return Response(CartSerializer(cart, context={'request': request}).data, status=status.HTTP_200_OK)

    def delete(self, request):
        """Clear entire cart."""
        cart = get_or_create_cart(request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared.'}, status=status.HTTP_200_OK)


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        """Update quantity of a specific cart item."""
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if not quantity or int(quantity) < 1:
            return Response({'error': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)

        item.quantity = int(quantity)
        item.save()

        cart = item.cart
        return Response(CartSerializer(cart, context={'request': request}).data)

    def delete(self, request, item_id):
        """Remove a specific item from cart."""
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart, context={'request': request}).data)