from django.db import models


# Create your models here.
class Apartment(models.Model):
    # owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='apartment')
    price = models.IntegerField()
    address = models.CharField(max_length=100)
    rooms = models.IntegerField()
    floor = models.IntegerField()
    area = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Квартира'
        verbose_name_plural = 'Квартиры'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.address}, {self.price}'
