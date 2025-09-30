from celery import shared_task
from todo.models import Task

@shared_task
def complete_all():
    # أي logic عايزاه يتنفذ
    Task.objects.update(is_completed=True)
