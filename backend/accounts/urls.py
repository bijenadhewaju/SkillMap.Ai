from django.urls import path
from .views import RegisterView, ProfileView, RequestPasswordResetEmail,SetNewPasswordAPIView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('password-reset/', RequestPasswordResetEmail.as_view(), name='password-reset'),
    path('password-reset-confirm/', SetNewPasswordAPIView.as_view(), name='password-reset-confirm'),
]