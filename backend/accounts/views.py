from django.contrib.auth import get_user_model, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAdminUser
from datetime import date
from .serializers import UserListSerializer
from .serializers import PhoneConfirmationRequestSerializer, PhoneCodeVerificationSerializer
from .models import CustomUser
from .permissions import CanManageUsers, CanAssignRoles, CanViewApplications, IsNotSelfOrReadOnly
from monitoring.models import DailyStats

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PhoneConfirmationRequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            obj = serializer.save()
            return Response({
                "message": "Код отправлен по SMS",
                "token": str(obj.token)
            }, status=201)
        print("Ошибки сериализатора:", serializer.errors)
        return Response(serializer.errors, status=400)


class VerifyPhoneView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PhoneCodeVerificationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            today = date.today()
            stat, _ = DailyStats.objects.get_or_create(date=today)
            stat.new_registers += 1
            stat.save()
            return Response({"message": "Регистрация завершена, пользователь вошёл в систему"})
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        phone = request.data.get('phone_number')
        if not phone:
            return Response({'error': 'Номер телефона обязателен'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(phone_number=phone)
            login(request, user)
            return Response({'message': 'Вход выполнен успешно'})
        except User.DoesNotExist:
            return Response({'error': 'Пользователь с таким номером не найден'}, status=status.HTTP_404_NOT_FOUND)


# Проверить, вошёл ли пользователь и получить его данные
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'email': request.user.email,
                'phone_number': request.user.phone_number,
                'first_name': request.user.first_name,
                'id': request.user.id,  # Добавил это
            })
        return Response({'user': None}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Выход выполнен'})


# Выдаёт csrftoken куку при GET
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    def get(self, request):
        return JsonResponse({'message': 'CSRF token set'})


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = UserListSerializer
    permission_classes = [CanManageUsers, IsNotSelfOrReadOnly]  # Изменяем permissions

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Дополнительная проверка (на всякий случай)
        instance = self.get_object()
        if instance == request.user:
            return Response(
                {"detail": "Нельзя удалить свой аккаунт"},  # ← Единый формат
                status=status.HTTP_403_FORBIDDEN
            )

        return super().destroy(request, *args, **kwargs)


class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = UserListSerializer
    permission_classes = [CanAssignRoles]


class AdminPanelAccess(APIView):
    permission_classes = [CanViewApplications]

    def get(self, request):
        # Возвращаем данные для всех вкладок админки
        return Response({
            "permissions": {
                "requests": True,
                "listings": True,
                "analytics": True,
                "users": True,
                "roles": True
            }
        })


class SelfDeleteAccount(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        # Выходим перед удалением
        logout(request)
        user.delete()
        return Response({"message": "Аккаунт успешно удален"}, status=status.HTTP_204_NO_CONTENT)


''' Для проверки тг пользователей на доступ к боту '''


class CheckPermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        telegram_id = request.query_params.get('telegram_id')
        print(request.query_params.get('telegram_id'))
        if not telegram_id:
            return Response({"error": "Telegram ID is required"}, status=400)

        try:
            user = CustomUser.objects.get(telegram_id=telegram_id)
        except CustomUser.DoesNotExist:
            return Response({
                "has_permission": False,
                "reason": "User not found"
            })

        # Проверяем права
        allowed_roles = ['moderator', 'manager', 'admin']
        has_permission = user.is_active and user.role in allowed_roles

        return Response({
            "has_permission": has_permission,
            "user_id": user.id,
            "role": user.role,
            "first_name": user.first_name,
            "email": user.email
        })
