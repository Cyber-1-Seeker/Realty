from django.urls import path
from .views import RegisterView, LoginView, MeView, LogoutView, GetCSRFToken, VerifyPhoneView
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-phone/', VerifyPhoneView.as_view(), name='verify_phone'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('csrf/', GetCSRFToken.as_view(), name='csrf'),
]

urlpatterns += router.urls  # 👈 обязательно
