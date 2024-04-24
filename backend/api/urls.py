from django.urls import path
from api.views import AddCartItemView, DeleteCartItemView, UpdateCartItemView, category_list,category_detail,category_prodcuts,ProductList,ProductDetail,ReviewList,ReviewDetial,UserSignUpAPIView,ProductPost, CartView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [
    path('categories/',category_list),
    path('categories/<int:id>', category_detail),
    path('categories/<int:id>/products', category_prodcuts),
    path('product/',ProductList.as_view()),
    path('product-post/',ProductPost.as_view()),
    path('product/<int:id>',ProductDetail.as_view()),
    path('review/',ReviewList.as_view()),
    path('review/<int:id>',ReviewDetial.as_view()),
    path('sign-in/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('sign-in/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('sign-up/', UserSignUpAPIView.as_view(), name='user-sign-up'),

    path('cart/', CartView.as_view()),
    path('add-to-cart/<int:product_id>/', AddCartItemView.as_view()),
    path('update-cart-item/<int:item_id>/', UpdateCartItemView.as_view()),
    path('delete-cart-item/<int:item_id>/', DeleteCartItemView.as_view()),

]


# #######################################################################
# Routing explanation categories get list of categories and we have post method for create category
# categories/id by this we can take a detailed data about category
# categories/id/products by this we can take a data about products in category by id
# product -> by this routing method we can take all products and create new product
# products/id -> by this routing method we can manipulate prodcut by id
# review -> by this routing method we can take all reviews and create new review
# review/id -> by this routing method we Create Read Update Delete by id
# sign-in -> by this routing method we can sign in
# sign-in/refresh -> by this routing method we refresh our tokens
# sign-out -> by this routing method we sign out
# #######################################################################