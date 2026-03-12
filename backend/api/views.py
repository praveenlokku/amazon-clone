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
import os
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

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
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data.get('orderItems')

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # (1) Create order
        order = Order.objects.create(
            user=user,
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

        # (3) Create order items
        for i in orderItems:
            try:
                # Try to get existing product by _id (if it's an integer) or ASIN
                try:
                    product_id = int(i['product'])
                    product = Product.objects.get(_id=product_id)
                except (ValueError, Product.DoesNotExist, TypeError):
                    product = Product.objects.filter(asin=i['product']).first()
                
                # If still not found, create a placeholder product for this transaction
                if not product:
                    # Get or create a default category
                    category, _ = Category.objects.get_or_create(name='Real Amazon Item')
                    
                    product = Product.objects.create(
                        name=i['name'],
                        price=i['price'],
                        image=i['image'],
                        asin=str(i['product'])[:20] if i['product'] else None,
                        countInStock=100,
                        category=category
                    )

                OrderItem.objects.create(
                    product=product,
                    order=order,
                    name=product.name,
                    qty=i['qty'],
                    price=i['price'],
                    image=product.image,
                )

                # (4) Update stock
                product.countInStock -= i['qty']
                product.save()

            except Exception as e:
                print(f"Error processing order item {i}: {e}")
                order.delete()
                return Response({'detail': f'Error creating order item: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

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


# Native Django Email configuration

@api_view(['POST'])
def send_otp(request):
    data = request.data
    email = data.get('email')

    if not email:
        return Response({'detail': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if user exists (for login flow)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None
        
        # Generate 6 digit OTP
        otp_code = str(random.randint(100000, 999999))
        
        # Create OTP record
        OTP.objects.create(user=user, email=email, code=otp_code)
        
        # LOGGING FOR DEVELOPMENT: Print OTP to console
        print(f"\n[OTP DEBUG] Verification code for {email}: {otp_code}\n")
        
        # Send Email using native Django code
        subject = f"{otp_code} is your Amazon Clone verification code"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [email]
        
        html_content = f"""
            <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #e7eaf3; padding: 40px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" alt="Amazon Logo" style="height: 40px;">
                </div>
                <h1 style="font-size: 28px; font-weight: 500; margin-bottom: 20px;">Verify your email address</h1>
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                    To verify your email address, please use the following One-Time Password (OTP):
                </p>
                <div style="font-size: 32px; font-weight: bold; color: #c45500; text-align: center; border: 1px solid #ddd; padding: 20px; border-radius: 4px; margin-bottom: 30px; letter-spacing: 5px;">
                    {otp_code}
                </div>
                <p style="font-size: 14px; color: #555; line-height: 1.5;">
                    Do not share this OTP with anyone. Amazon takes your account security very seriously. 
                    Amazon Customer Service will never ask you to disclose or verify your Amazon password, OTP, credit card, or banking account number.
                </p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">
                    © 2026 Amazon Clone, Inc. or its affiliates. All rights reserved.
                </p>
            </div>
        """
        
        text_content = f"Your Amazon Clone verification code is {otp_code}. Do not share this with anyone."
        
        try:
            msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except Exception as email_error:
            print(f"[OTP ERROR] Failed to send email via Django: {email_error}")
            # Still returning success message as the code is in the database and console for dev
            return Response({'detail': 'OTP generated. Please check server console if email delivery fails.'})

        return Response({'detail': 'OTP sent successfully to email'})

    except Exception as e:
        print(f"[CRITICAL ERROR] send_otp view failed: {e}")
        return Response({'detail': f'Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def verify_otp(request):
    data = request.data
    email = data.get('email')
    code = data.get('code')
    is_registration = data.get('is_registration', False)

    if not email or not code:
        return Response({'detail': 'Email and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Find the latest unused OTP for this email
        otp = OTP.objects.filter(email=email, code=code, is_used=False).order_by('-created_at').first()

        if otp:
            otp.is_used = True
            otp.save()
            
            # If it's a login flow, return user data
            if not is_registration:
                try:
                    user = User.objects.get(email=email)
                    serializer = UserSerializerWithToken(user, many=False)
                    return Response(serializer.data)
                except User.DoesNotExist:
                    # This shouldn't happen if user exists check was done in send_otp login flow
                    return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # For registration, just return success
            return Response({'detail': 'OTP verified successfully'})
        else:
            return Response({'detail': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"Error verifying OTP: {e}")
        return Response({'detail': 'Verification failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
