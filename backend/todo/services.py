from .models import Task
from rest_framework.pagination import PageNumberPagination


class DefaultPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

def mark_all_tasks_completed(is_completed):
    return Task.complete_all(is_completed)