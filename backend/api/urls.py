from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, CategoryViewSet, addOrderItems, getOrderById, 
    searchRealProducts, getRealProductDetails,
    MyTokenObtainPairView, registerUser, getUserProfile, getMyOrders,
    createProductReview, send_otp, verify_otp
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    
    # Auth Endpoints
    path('users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', registerUser, name='register'),
    path('users/profile/', getUserProfile, name='user-profile'),
    path('users/send-otp/', send_otp, name='send-otp'),
    path('users/verify-otp/', verify_otp, name='verify-otp'),

    path('amazon/search/', searchRealProducts, name='amazon-search'),
    path('amazon/product/<str:asin>/', getRealProductDetails, name='amazon-product'),
    path('orders/my/', getMyOrders, name='user-orders'),
    path('orders/add/', addOrderItems, name='order-add'),
    path('orders/<str:pk>/', getOrderById, name='order-get'),
    path('products/<str:pk>/reviews/', createProductReview, name='create-review'),
]
