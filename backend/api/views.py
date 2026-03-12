from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, ShippingAddress, Category, Review, OTP
from .serializers import (
    ProductSerializer, OrderSerializer, CategorySerializer, 
    UserSerializer, UserSerializerWithToken
)
from .amazon_service import AmazonService
from django.db.models import Q
import random
import resend
import os

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        query = self.request.query_params.get('keyword')
        category = self.request.query_params.get('category')

        if query:
            queryset = queryset.filter(name__icontains=query)
        
        if category:
            queryset = queryset.filter(category__name__iexact=category)

        return queryset

@api_view(['POST'])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data.get('orderItems')

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # (1) Create order
        order = Order.objects.create(
            user=user if user.is_authenticated else None,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # (3) Create order items and set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image,
            )

            # (4) Update stock
            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
def getOrderById(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def searchRealProducts(request):
    query = request.query_params.get('keyword')
    category = request.query_params.get('category')
    
    if not query:
        return Response({'detail': 'Keyword is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    results = AmazonService.search_products(query, category)
    return Response(results)

@api_view(['GET'])
def getRealProductDetails(request, asin):
    details = AmazonService.get_product_details(asin)
    if details:
        return Response(details)
    return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

# Authentication Views
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

resend.api_key = os.getenv('RESEND_API_KEY')

@api_view(['POST'])
def send_otp(request):
    data = request.data
    email = data.get('email')

    if not email:
        return Response({'detail': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        
        # Generate 6 digit OTP
        otp_code = str(random.randint(100000, 999999))
        
        # Create OTP record
        OTP.objects.create(user=user, code=otp_code)
        
        # Send Email
        params = {
            "from": "Acme <onboarding@resend.dev>",
            "to": [email],
            "subject": "Your Amazon Clone OTP",
            "html": f"<strong>Your one-time password is: {otp_code}</strong>",
        }
        resend.Emails.send(params)

        return Response({'detail': 'OTP sent successfully to email'})

    except User.DoesNotExist:
        return Response({'detail': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error sending OTP: {e}")
        return Response({'detail': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def verify_otp(request):
    data = request.data
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return Response({'detail': 'Email and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        otp = OTP.objects.filter(user=user, code=code, is_used=False).order_by('-created_at').first()

        if otp:
            otp.is_used = True
            otp.save()
            
            # Login the user
            serializer = UserSerializerWithToken(user, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({'detail': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all().order_by('-createdAt')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # (1) Review already exists
    alreadyExists = product.reviews.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # (2) No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # (3) Create Review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.reviews.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')
