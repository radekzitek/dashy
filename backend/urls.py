"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    UserRegistrationView,
    UserProfileUpdateAPIView,
    UserProfileAPIView,
    LogEntryAPIView,
    ChangePasswordView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/register/", UserRegistrationView.as_view(), name="register"),
    path("api/profile/", UserProfileAPIView.as_view(), name="user_profile"),
    path(
        "api/profile/update/",
        UserProfileUpdateAPIView.as_view(),
        name="user_profile_update",
    ),
    path("api/logs/", LogEntryAPIView.as_view(), name="log_entry"),
    path("api/password/change/", ChangePasswordView.as_view(), name="change_password"),
]
