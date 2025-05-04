from django.contrib.auth.models import User
from rest_framework import serializers

# users/serializers.py
class UserRegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=['customer', 'employee'], default='customer')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role', 'customer')
        user = User.objects.create_user(**validated_data)
        # Attach role logic can be handled in views
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
