from django.urls import path
from .views import CartView, CartItemView

urlpatterns = [
    path('',             CartView.as_view(),     name='cart'),           # GET / POST / DELETE
    path('<int:item_id>/', CartItemView.as_view(), name='cart-item'),    # PATCH / DELETE
]