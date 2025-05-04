from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from users.permissions import IsEmployee

class TransactionTestView(APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        return Response({"message": "Employee access to transactions confirmed."})
