from django.test import TestCase
from django.urls import reverse
from .models import Task
import json


class TaskTests(TestCase):
    def setUp(self):
        Task.objects.create(title="Test Task 1")
        Task.objects.create(title="Test Task 2")

    def _parse_list_response(self, response):
        data = json.loads(response.content)
        if isinstance(data, dict) and 'results' in data:
            return data['results']
        return data

    def test_add_task_get(self):
        response = self.client.get(reverse('tasks-list'))
        self.assertEqual(response.status_code, 200)
        tasks = self._parse_list_response(response)
        self.assertIsInstance(tasks, list)
        self.assertEqual(len(tasks), 2)

    def test_add_task_post(self):
        response = self.client.post(
            reverse('tasks-list'),
            data=json.dumps({"title": "New Task"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        task = json.loads(response.content)
        self.assertEqual(task.get("title"), "New Task")
        self.assertTrue(Task.objects.filter(title="New Task").exists())

    def test_add_task_post_no_title(self):
        response = self.client.post(
            reverse('tasks-list'),
            data=json.dumps({}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        error = json.loads(response.content)
        self.assertIn('title', error)
    
    def test_all_tasks_are_completed(self):
        response = self.client.post(
            reverse('tasks-complete-all'),
            data=json.dumps({"is_completed": True}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Task.objects.filter(is_completed=True).count(), Task.objects.count())

    def test_delete_all_completed_tasks(self):
        # mark one as completed
        task1 = Task.objects.get(title="Test Task 1")
        task1.is_completed = True
        task1.save()
        # call delete endpoint
        response = self.client.delete(reverse('tasks-delete-completed'))
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Task.objects.filter(is_completed=True).exists())
