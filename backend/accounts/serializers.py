from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import UserProfile, Education
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ('id', 'degree_level', 'stream', 'status', 'timeline')

class ProfileSerializer(serializers.ModelSerializer):
    # This automatically fetches all linked Education records for this profile
    educations = EducationSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'email', 'experience_years', 'previous_role', 'target_career', 'bio', 'educations')

# --- Password Reset Serializers ---

class ResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, min_length=8)
    token = serializers.CharField(write_only=True)
    uidb64 = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            # Decode the User ID and fetch the user
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            # Check if the token is valid for this specific user
            if not default_token_generator.check_token(user, token):
                raise serializers.ValidationError('The reset link is invalid or has expired.')
        except Exception:
            raise serializers.ValidationError('The reset link is invalid or has expired.')

        return attrs