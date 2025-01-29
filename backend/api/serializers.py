from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate


class UserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        errors = []

        # username validation
        if User.objects.filter(username=username).exists():
            errors.append("A user with this username already exists")
        if len(username) < 4:
            errors.append("Username must be at least 4 characters long")

        # password validation
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        if not any(char.isdigit() for char in password):
            errors.append("Password must contain at least one numeric digit")
        if not any(char.isupper() for char in password):
            errors.append(
                "Password must contain at least one uppercase letter")
        if not any(char.islower() for char in password):
            errors.append(
                "Password must contain at least one lowercase letter")

        if errors:
            # Change the error structure here to be consistent with the LoginSerializer
            raise serializers.ValidationError({"detail": {"errors": errors}})

        return data

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        errors = []

        if not User.objects.filter(username=username).exists():
            errors.append("Username does not exist")
        else:
            user = authenticate(username=username, password=password)
            if user is None:
                errors.append("Password is incorrect")

        if errors:
            raise serializers.ValidationError({"detail": {"errors": errors}})

        return {'user': user}
