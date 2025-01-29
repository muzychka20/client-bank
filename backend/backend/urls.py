from django.contrib import admin
from django.urls import path, include
from api.views.CreateUserView import CreateUserView
from api.views.LoginUserView import LoginUserView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/login/", LoginUserView.as_view(), name="login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api/", include("api.urls")),
]
