from rest_framework import viewsets,status
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.decorators import action   # 
from .models import Task
from .serializers import TaskSerializer
from .serializers import IsCompletedSerializer
from .services import mark_all_tasks_completed
from django_filters.rest_framework import DjangoFilterBackend



class TaskViewSet(viewsets.ModelViewSet):

    queryset = Task.objects.all().order_by("-id")
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "is_completed": ["exact"],
        "is_deleted": ["exact"],
    }
    search_fields = ["title"]
    ordering_fields = ["id", "created_at", "updated_at", "title"]
    ordering = ["-id"]

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    def get_is_completed_from_request(self, data):
        return self.get_is_completed_from_data(data)

    def get_is_completed_from_data(self, data):
        serializer = IsCompletedSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data['is_completed']

    def get_queryset(self):
        return Task.objects.all()

    @action(detail=False, methods=['get'], url_path='count')
    def count(self, request, *args, **kwargs):
        is_completed = self.get_is_completed_from_data(request.query_params)
        count = Task.objects.filter(is_completed=is_completed).count()
        return Response({"count" : count})

    @action(detail=False, methods=['post'], url_path='complete-all')
    def complete_all(self, request, *args, **kwargs):
        is_completed = self.get_is_completed_from_data(request.data)
        updated = mark_all_tasks_completed(is_completed)
    
        return Response({'message':f"{updated} tasks marked as completed : {is_completed} ."})


    @action(detail=False, methods=['delete'], url_path='completed')
    def delete_completed(self, request, *args, **kwargs):
        # Bulk soft-delete completed tasks
        updated = Task.all_objects.filter(is_completed=True, is_deleted=False).update(is_deleted=True)
        if updated == 0:
            return Response(status=204)
        return Response(status=204)
    
    
