from rest_framework import serializers
from .models import Product, Category,Review,User
from django.contrib.auth.hashers import make_password
from .models import Cart, CartItem



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']



class UserSerializer(serializers.Serializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField()
    email = serializers.EmailField()

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        user = User.objects.create(**validated_data)
        return user



class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'content', 'rating']
        read_only_fields = ['user'] 
    rating = serializers.IntegerField()

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    

class ProductSerializer(serializers.Serializer):
    class Meta:
        model = Product
        fields = ['id', 'user', 'name','image', 'description', 'brand','category_id','rating','price']

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    image = serializers.CharField(max_length=255)
    description = serializers.CharField(max_length=255)
    brand =serializers.CharField(max_length=255)
    category_id = serializers.IntegerField(read_only=True)  
    rating = serializers.IntegerField()
    price = serializers.FloatField()



    def create(self, validated_data):
        category = Category.objects.get(pk=validated_data['category_id'])
        return Product.objects.create(category=category, **validated_data)

    def update(self, instance, validated_data):

        instance.name = validated_data.get('name', instance.name)
        instance.image = validated_data.get('image', instance.image)
        instance.description = validated_data.get('description', instance.description)
        instance.brand = validated_data.get('brand', instance.brand)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.price = validated_data.get('price', instance.price)

        category_id = validated_data.get('category_id')

        if category_id :
            instance.category = category_id
        instance.save()
        return instance
    


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']