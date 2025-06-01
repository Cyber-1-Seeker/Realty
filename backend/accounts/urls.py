from django.urls import path
from .views import RegisterView, LoginView, MeView, LogoutView, GetCSRFToken, VerifyPhoneView, UserViewSet, \
    UserRoleViewSet, AdminPanelAccess, SelfDeleteAccount, CheckPermissionsView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'role-users', UserRoleViewSet, basename='role-users')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-phone/', VerifyPhoneView.as_view(), name='verify_phone'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('csrf/', GetCSRFToken.as_view(), name='csrf'),
    path('admin/check-access/', AdminPanelAccess.as_view()),
    path('users/me/delete/', SelfDeleteAccount.as_view(), name='self-delete-account'),
    path('check-permissions/', CheckPermissionsView.as_view(), name='check-permissions'),
]

urlpatterns += router.urls
