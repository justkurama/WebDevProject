from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
from api.models import Category, Product, Review,User
from rest_framework.parsers import JSONParser

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.views.decorators.csrf import csrf_exempt
from .serializers import CategorySerializer, ProductSerializer,ReviewSerializer,UserSerializer,CartSerializer, CartItemSerializer


from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics

from django.db.models import Q
from django_filters import rest_framework as filters
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Product




# 3 FBV views
@csrf_exempt
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories,many=True)
        return JsonResponse(serializer.data,safe=False)
    
@csrf_exempt
def category_detail(request,id):
    category = get_object_or_404(Category,id=id)
    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return JsonResponse(serializer.data)
    
@csrf_exempt
def category_prodcuts(request,id):
    category = get_object_or_404(Category,id=id)
    products = category.products.all()
    data = {'products':list(products.values())}
    return JsonResponse(data)





class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  
    page_size_query_param = 'page_size'  
    max_page_size = 100 


class ProductFilter(filters.FilterSet):
    price_from = filters.NumberFilter(field_name="price", lookup_expr='gte')
    price_to = filters.NumberFilter(field_name="price", lookup_expr='lte')
    rating = filters.NumberFilter(field_name="rating")

    class Meta:
        model = Product
        fields = ['category__name', 'price_from', 'price_to', 'rating']


# CBV 5 views
class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ProductFilter 
    ordering_fields = ['price', 'category__name', 'rating']
    ordering = ['price', 'rating']

    def get_queryset(self):
     
        queryset = super().get_queryset()
        price_from = self.request.query_params.get('price_from')
        price_to = self.request.query_params.get('price_to')
        rating = self.request.query_params.get('rating')


        conditions = Q()

        if price_from and price_to:
            conditions &= Q(price__gte=price_from, price__lte=price_to)

        if rating:
            conditions &= Q(rating=rating)


        if conditions:
            queryset = queryset.filter(conditions)

        return super().get_queryset()
    


class ProductPost(APIView):

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class ProductDetail(APIView):
    def get_object(self,id):
        try:
            return Product.objects.get(pk=id)
        except Product.DoesNotExist:
            raise Http404
    

    def get(self,request,id):
        product = self.get_object(id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    def put(self,request,id):
        product= self.get_object(id)
        serializer = ProductSerializer(product,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,id):
        product = self.get_object(id)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ReviewList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        product_id = request.query_params.get('product_id')
        if product_id:

            reviews = Review.objects.filter(product_id=product_id)
        else:

            reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        print(request.data) 
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewDetial(APIView):

    def get_object(self,id):
        try:
            return Review.objects.get(pk=id)
        except Review.DoesNotExist:
            raise Http404
        
    def get(self,request,id):
        review = self.get_object(id)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)
    
    def put(self,request,id):
        review = self.get_object(id)
        serializer = ReviewSerializer(review,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,id):
        review  = self.get_object(id)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class UserSignUpAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class CartView(APIView):
    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
class AddCartItemView(APIView):
    def post(self, request, product_id):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product = get_object_or_404(Product, pk=product_id)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += 1
            item.save()
        serializer = CartItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UpdateCartItemView(APIView):
    def put(self, request, item_id):
        item = get_object_or_404(CartItem, id=item_id)
        item.quantity = request.data.get('quantity', item.quantity)
        item.save()
        return Response(CartItemSerializer(item).data)

class DeleteCartItemView(APIView):
    def delete(self, request, item_id):
        item = get_object_or_404(CartItem, id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)