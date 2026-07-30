from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Custom Accounts Endpoints (Registration, Profile, Login)
    path('api/accounts/', include('accounts.urls')),
    # JWT Refresh Endpoint
    path('api/accounts/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API endpoints (generic)
    path('api/', include('api.urls')),
]
