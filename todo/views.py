from django.http import JsonResponse
import json
from .models import Task
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TaskSerializer
from rest_framework.response import Response
from rest_framework.decorators import action   # 

tasks = []

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("-id")
    serializer_class = TaskSerializer

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    

    @action(detail=False, methods=['get'], url_path='not-completed-count')
    def not_completed_count(self, request):
        count = Task.objects.filter(is_completed=False).count()
        return Response(count)
    
