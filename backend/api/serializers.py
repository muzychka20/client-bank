from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        errors = {}

        username = data.get("username", "")
        password = data.get("password", "")

        errors["errors"] = []        

        # username validation
        if len(username) < 4:
            errors["errors"].append("Username must be at least 4 characters long")
        if User.objects.filter(username=username).exists():
            errors["errors"].append("A user with this username already exists")

        # password validation
        if len(password) < 8:
            errors["errors"].append("Password must be at least 8 characters long")
        if not any(char.isdigit() for char in password):
            errors["errors"].append("Password must contain at least one numeric digit")
        if not any(char.isupper() for char in password):
            errors["errors"].append("Password must contain at least one uppercase letter")
        if not any(char.islower() for char in password):
            errors["errors"].append("Password must contain at least one lowercase letter")     

        if errors["errors"]:
            raise serializers.ValidationError({"detail": errors})
        
        return data

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
