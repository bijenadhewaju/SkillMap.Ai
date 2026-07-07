from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import UserProfile, Education, Career
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return lower_email

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
    educations = EducationSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    target_career = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    previous_role = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'email', 'experience_years', 'previous_role', 'target_career', 'bio', 'educations')

    def update(self, instance, validated_data):
        raw_data = self.initial_data

        instance.experience_years = validated_data.get('experience_years', instance.experience_years)
        instance.previous_role = validated_data.get('previous_role', instance.previous_role)

        # Convert the text (e.g. "Banker") into a Career database object
        career_name = validated_data.get('target_career')
        if career_name:
            career_obj, created = Career.objects.get_or_create(title=career_name)
            instance.target_career = career_obj

        instance.save()

        educations_data = raw_data.get('educations')
        if educations_data is not None:
            instance.educations.all().delete()
            for edu in educations_data:
                Education.objects.create(
                    user_profile=instance,
                    degree_level=edu.get('degree_level', ''),
                    stream=edu.get('stream', ''),
                    status=edu.get('status', ''),
                    timeline=edu.get('timeline', '')
                )

        return instance

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
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not default_token_generator.check_token(user, token):
                raise serializers.ValidationError('The reset link is invalid or has expired.')
        except Exception:
            raise serializers.ValidationError('The reset link is invalid or has expired.')
        return attrs