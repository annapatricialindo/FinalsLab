from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        groups = user.groups.values_list('name', flat=True)

        # Sync role based on group name
        for role_name in ['admin', 'employee', 'customer']:
            if role_name in groups:
                if user.role != role_name:
                    user.role = role_name
                    user.save(update_fields=['role'])
                break

        return Response(UserSerializer(user).data)
    
from rest_framework import generics
from .models import User
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]