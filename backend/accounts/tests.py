import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models import UserProfile


@pytest.mark.django_db
class TestAuthentication:
    def setup_method(self):

        self.client = APIClient()
        self.register_url = '/api/accounts/register/'
        self.login_url = '/api/accounts/login/'
        self.profile_url = '/api/accounts/profile/'

        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'securepassword123'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        assert response.status_code == 201
        assert 'access' in response.data

    def test_user_login(self):
        User.objects.create_user(**self.user_data)
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        assert response.status_code == 200
        assert 'access' in response.data

    def test_profile_unauthorized_access(self):
        response = self.client.get(self.profile_url)
        assert response.status_code == 401

    def test_profile_authorized_access(self):
        user = User.objects.create_user(**self.user_data)
        UserProfile.objects.create(user=user)
        self.client.force_authenticate(user=user)

        response = self.client.get(self.profile_url)
        assert response.status_code == 200
        assert response.data['username'] == self.user_data['username']