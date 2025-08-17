from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import Doctor, Slot, Appointment, Leave, CustomUser
import random
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
User = get_user_model()

# from django.contrib.auth import get_user_model



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id','username','email','password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        user.is_active = False
        # here i created OTP
        otp = str(random.randint(100000, 999999))
        user.otp = otp
        user.save()

        send_mail(
            'Your OTP Code',
            f'Your OTP is {otp}',
            'noreply@clinicapp.com',
            [user.email],
            fail_silently=False,
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id','username','email')

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)  
    slot = SlotSerializer(read_only=True)
    class Meta:
        model = Appointment
        fields = ['id', 'patient_name', 'age', 'appointment_date', 'doctor', 'slot']

    def validate(self, data):
        from datetime import date, timedelta
        
        # Validation for appointment interms of date
        if data['appointment_date'] <= date.today():
            raise serializers.ValidationError("Appointment must be from tomorrow onward.")
        if data['appointment_date'] > date.today() + timedelta(days=30):
            raise serializers.ValidationError("Appointment cannot be more than 30 days in advance.")

        # Checking if the doctor is on leave on the specified date and slot
        if Leave.objects.filter(
            doctor=data['doctor'],
            date=data['appointment_date'],
            slot=data['slot']
        ).exists():
            raise serializers.ValidationError("The selected doctor is on leave on this date and time.")

        return data
    
    
from .models import Leave

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ['id', 'doctor', 'date', 'slot']


