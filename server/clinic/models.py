from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime, timedelta
from django.utils import timezone
from django.conf import settings

class CustomUser(AbstractUser):
    
    email = models.EmailField(unique=True, blank=False)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def set_otp(self, otp_code):
        self.otp = otp_code
        self.otp_created_at = timezone.now()
        self.save()

    def is_otp_valid(self, otp_code):
    # checking valid otp or expired
        if self.otp != otp_code:
            return False
        # OTP is valid for 5 minutes.
        return (timezone.now() - self.otp_created_at) < timedelta(minutes=5)

    def __str__(self):
        return self.username




class Doctor(models.Model):
    name = models.CharField(max_length=100)
    speciality = models.CharField(max_length=100)
    department = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Slot(models.Model):
    SLOT_CHOICES = [
        ("10:00-11:30", "10:00-11:30"),
        ("12:00-13:00", "12:00-13:00"),
        ("15:00-16:30", "15:00-16:30"),
        ("19:00-20:00", "19:00-20:00"),
    ]
    time = models.CharField(max_length=20, choices=SLOT_CHOICES, unique=True)

    def __str__(self):
        return self.time

class Leave(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['doctor', 'date', 'slot']



class Appointment(models.Model):
    patient_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    appointment_date = models.DateField()
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['doctor', 'appointment_date', 'slot']


# Create your models here.
