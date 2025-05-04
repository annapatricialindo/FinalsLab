from rest_framework import serializers
from .models import User
from django.contrib.auth.models import Group

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

    def get_group_role(self, obj):
        return obj.role

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role='customer'
        )

        customer_group, created = Group.objects.get_or_create(name='customer')
        user.groups.add(customer_group)

        return user