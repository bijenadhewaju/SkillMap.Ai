from django.contrib.auth.models import User
from django.db.models import Q


class EmailAuthBackend:
    """
    Custom authentication backend that allows users to log in using their email address.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Check if the user exists by looking up the email (or username, just in case)
            user = User.objects.get(Q(email__iexact=username) | Q(username__iexact=username))

            # If the user exists, check if the password matches
            if user.check_password(password):
                return user
            return None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None