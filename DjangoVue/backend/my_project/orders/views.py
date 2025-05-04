from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from users.permissions import IsCustomer

class OrderTestView(APIView):
    permission_classes = [IsCustomer]

    def get(self, request):
        return Response({"message": "Customer access to orders confirmed."})
