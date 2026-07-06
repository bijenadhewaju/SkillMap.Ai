from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer,ResetPasswordEmailSerializer, SetNewPasswordSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Instantly generate JWT tokens so the user is logged in upon registering
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET: Fetches the logged-in user's profile and education.
    PUT/PATCH: Updates the logged-in user's profile.
    """
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,) # This absolutely locks the endpoint down

    def get_object(self):
        # Instead of looking up an ID in the URL, we use the token to find the user!
        return self.request.user.profile


# --- Password Reset Views ---

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            # Encode user ID and generate a secure, one-time token
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            # This is the URL your React app will eventually handle
            reset_url = f"http://localhost:5173/reset-password/{uidb64}/{token}/"

            # "Send" the email
            send_mail(
                subject="Reset your SkillMap AI Password",
                message=f"Hello, \n\nUse this link to reset your password: \n{reset_url}\n\nIf you did not request this, please ignore this email.",
                from_email="noreply@skillmap.ai",
                recipient_list=[user.email],
                fail_silently=False,
            )

        # Always return success to prevent bad actors from guessing emails
        return Response({'success': 'If an account exists, a reset link has been sent.'}, status=status.HTTP_200_OK)


class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = (AllowAny,)

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Grab validated data
        uidb64 = serializer.validated_data['uidb64']
        password = serializer.validated_data['password']

        # Find user and save new password
        id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(id=id)
        user.set_password(password)
        user.save()

        return Response({'success': 'Password reset successfully.'}, status=status.HTTP_200_OK)