from django.db import models
from django.core.validators import MaxLengthValidator


class Testimonial(models.Model):
    name = models.CharField(max_length=100, verbose_name='Имя', validators=[MaxLengthValidator(50)])
    text = models.TextField(verbose_name='Текст отзыва')
    is_active = models.BooleanField(default=True, verbose_name='Активный')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.created_at}"

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
