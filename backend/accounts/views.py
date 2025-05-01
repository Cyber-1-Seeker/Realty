from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)  # <-- автоматический вход после регистрации
            return Response({'message': 'Пользователь создан'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class MeView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'email': request.user.email,
                'phone_number': request.user.phone_number,
                'first_name': request.user.first_name,
            })
        return Response({'user': None}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Выход выполнен'})


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    def get(self, request):
        return JsonResponse({'message': 'CSRF token set'})
