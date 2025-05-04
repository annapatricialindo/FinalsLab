from django.urls import path
from .views import RegisterView, LoginView, LogoutView, EmployeeOnlyView, CustomerOnlyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('employee/', EmployeeOnlyView.as_view(), name='employee-view'),
    path('customer/', CustomerOnlyView.as_view(), name='customer-view'),
]
