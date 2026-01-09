from django.contrib.auth.models import AbstractUser, Group, Permission


# Create your models here.
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('author', 'Author'),
        ('editor', 'Editor'),
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='author'
    )

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions_set',
        blank=True
    )

    def __str__(self):
        return self.username
