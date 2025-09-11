from django.test import TestCase
from django.urls import reverse
from .models import Task
import json
class TaskTests(TestCase):
    def setUp(self):
        Task.objects.create(title="Test Task 1")
        Task.objects.create(title="Test Task 2")

    def test_add_task_get(self):
        response = self.client.get(reverse('add_task'))
        self.assertEqual(response.status_code, 200)
        tasks = json.loads(response.content).get("tasks")
        self.assertEqual(len(tasks), 2)

    def test_add_task_post(self):
        response = self.client.post(
            reverse('add_task'),
            data=json.dumps({"title": "New Task"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        task = json.loads(response.content)
        self.assertEqual(task.get("title"), "New Task")
        self.assertTrue(Task.objects.filter(title="New Task").exists())

    def test_add_task_post_no_title(self):
        response = self.client.post(
            reverse('add_task'),
            data=json.dumps({}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        error = json.loads(response.content).get("error")
        self.assertEqual(error, "Title is required")