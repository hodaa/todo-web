from django.db import models


class TaskQuerySet(models.QuerySet):
    def delete(self):
        # Soft-delete in bulk
        return super().update(is_deleted=True)

    def hard_delete(self):
        return super().delete()

    def alive(self):
        return self.filter(is_deleted=False)

    def dead(self):
        return self.filter(is_deleted=True)

class TaskManager(models.Manager):
    def get_queryset(self):
        return TaskQuerySet(self.model, using=self._db).alive()


class Task(models.Model):
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = TaskManager()         
    all_objects = TaskQuerySet.as_manager()  

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save(update_fields=["is_deleted", "updated_at"])

    def hard_delete(self, *args, **kwargs):
        return super().delete(*args, **kwargs)

    @classmethod
    def complete_all(cls, is_completed):
        return cls.objects.all().update(is_completed=is_completed)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=["is_deleted"]),
            models.Index(fields=["is_completed"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["is_deleted", "is_completed", "created_at"]),
        ]
