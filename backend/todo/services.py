from .models import Task

def mark_all_tasks_completed(is_completed):
    return Task.complete_all(is_completed)