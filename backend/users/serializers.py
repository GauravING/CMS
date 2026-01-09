from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def validate_email(self, value: str) -> str:
        value = (value or "").strip().lower()
        if not value:
            raise serializers.ValidationError("Email is required")
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already registered")
        return value

    def validate_password(self, value: str) -> str:
        try:
            User().set_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        if not value or len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            role=validated_data.get('role', 'author')
        )
        return user


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "first_name", "last_name", "date_joined")


class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "is_active", "is_staff", "is_superuser", "date_joined")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allow login with either username or email via the same JWT endpoint."""

    username_field = "username"

    email = serializers.EmailField(required=False, write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if "username" in self.fields:
            self.fields["username"].required = False

    def validate(self, attrs):
        identifier = attrs.get("username") or attrs.get("email")
        password = attrs.get("password")

        if identifier and "@" in identifier:
            user = User.objects.filter(email__iexact=identifier.strip()).only("username").first()
            if user:
                attrs["username"] = user.username
        elif identifier:
            attrs["username"] = identifier

        attrs.pop("email", None)
        attrs["password"] = password
        return super().validate(attrs)


class TokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
