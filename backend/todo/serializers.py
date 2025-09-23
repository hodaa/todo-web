from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "is_completed", "created_at"]
        read_only_fields = ["id", "created_at"]


class IsCompletedSerializer(serializers.Serializer):
    is_completed = serializers.BooleanField()
