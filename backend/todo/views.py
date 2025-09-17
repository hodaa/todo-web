from rest_framework import viewsets,status
from rest_framework.response import Response
from rest_framework.decorators import action   # 
from .models import Task
from .serializers import TaskSerializer
from .serializers import IsCompletedSerializer


class TaskViewSet(viewsets.ModelViewSet):

    queryset = Task.objects.all().order_by("-id")
    serializer_class = TaskSerializer

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    def get_queryset(self):

        queryset = Task.objects.all()
        completed = self.request.query_params.get('is_completed')
        if completed is not None:
            if completed.lower() == 'true':
                queryset = queryset.filter(is_completed=True)
            elif completed.lower() == 'false':
                queryset = queryset.filter(is_completed=False)
        return queryset

    @action(detail=False, methods=['get'], url_path='count')
    def count(self,request):
        serializer = IsCompletedSerializer(data = request.query_params)
        serializer.is_valid(raise_exception = True)
        is_completed = serializer.validated_data['is_completed']
        count = Task.objects.filter(is_completed=is_completed).count()
        return Response({"count" : count})

    @action(detail=False, methods=['post'], url_path='complete-all')
    def complete_all(self, request):
        serializer = IsCompletedSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        is_completed = serializer.validated_data['is_completed']
        updated = Task.objects.all().update(is_completed = is_completed)
    
        return Response({'message':f"{updated} tasks marked as completed : {is_completed} ."})


    @action(detail=False, methods=['delete'], url_path='completed')
    def delete_completed(self, request):
        queryset = Task.objects.filter(is_completed=True)
        deleted_count, _ = queryset.delete()
        if deleted_count == 0:
            return Response(status=204)
        return Response(status=204)
    
    
