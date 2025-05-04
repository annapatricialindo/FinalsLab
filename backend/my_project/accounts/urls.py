from django.urls import path
from .views import UserInfoView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('me/', UserInfoView.as_view()),
]
