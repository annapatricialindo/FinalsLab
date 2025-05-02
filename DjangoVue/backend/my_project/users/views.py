from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import Serializer, CharField, EmailField

class UserRegisterSerializer(Serializer):
    username = CharField(max_length=100)
    email = EmailField()
    password = CharField(max_length=100)

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)  # This creates a session
            return Response({"message": "Login successful"})
        else:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.response import Response

class LogoutView(APIView):
    def post(self, request):
        logout(request)

        response = Response({"message": "Logged out successfully"})

        # Set the 'sessionid' cookie to expire
        response.delete_cookie('sessionid')

        return response

