from django.db import models

class TaskManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class Task(models.Model):
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = TaskManager()         
    all_objects = models.Manager()  

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

    @classmethod
    def complete_all(cls, is_completed):
        return cls.objects.all().update(is_completed=is_completed)

    def __str__(self):
        return self.title
