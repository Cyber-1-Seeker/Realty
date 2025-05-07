from django.contrib.auth import get_user_model, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .serializers import UserListSerializer
from .serializers import PhoneConfirmationRequestSerializer, PhoneCodeVerificationSerializer
from .models import CustomUser

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        serializer = PhoneConfirmationRequestSerializer(data=request.data)
        if serializer.is_valid():
            obj = serializer.save()
            return Response({
                "message": "Код отправлен по SMS",
                "token": str(obj.token)
            }, status=201)
        print("Ошибки сериализатора:", serializer.errors)
        return Response(serializer.errors, status=400)


class VerifyPhoneView(APIView):
    def post(self, request):
        serializer = PhoneCodeVerificationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            return Response({"message": "Регистрация завершена, пользователь вошёл в систему"})
        return Response(serializer.errors, status=400)


class LoginView(APIView):
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
    permission_classes = [IsAdminUser]
