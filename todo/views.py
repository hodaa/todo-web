from django.http import JsonResponse
import json
from .models import Task
from django.shortcuts import render

tasks = []

def home(request):
    tasks = Task.objects.all().order_by('-created_at')
    return render(request, "todo/index.html" ,{"tasks": tasks})

def tasks_list(request):
    return JsonResponse({"tasks": ["task 1", "task 2"]})


def add_task(request):
    if request.method == "GET":
        tasks = list(Task.objects.values("id", "title"))
        return JsonResponse({"tasks": tasks})
    
    elif request.method == "POST":
        data = json.loads(request.body)
        title = data.get("title")
        if not title:
            return JsonResponse({"error": "Title is required"}, status=400)
        task = Task.objects.create(title=title)
        return JsonResponse({"id": task.id, "title": task.title}, status=201)
