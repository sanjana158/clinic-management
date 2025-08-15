from django.shortcuts import render
from rest_framework import generics, permissions
# from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import Doctor, Appointment, CustomUser
from .serializers import RegisterSerializer, UserSerializer, DoctorSerializer, AppointmentSerializer
from rest_framework.views import APIView
from rest_framework import status
from .utils import send_otp_email
import random
from django.contrib.auth import get_user_model
User = get_user_model()



class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    
    def perform_create(self, serializer):
        user = serializer.save(is_active=False)  
        # inorder to generate OTP
        otp = random.randint(100000, 999999)

        # saved otp in UserOTP model
        user.otp = otp
        user.save()

        # Send OTP via email
        send_otp_email(user.email, otp)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class DoctorListView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class AppointmentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AppointmentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            # user_otp = CustomUser.objects.get(user__email=email)
            user = User.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)
        if user.is_otp_valid(otp):
            user.is_verified = True
            user.is_active = True
            user.otp = None  # Clear the OTP after successful verification
            user.save()
            return Response(
                {'message': 'Account successfully verified. You can now log in.'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Invalid or expired OTP.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # if user.is_otp_valid(otp):
        #     user.user.is_active = True
        #     user_otp.user.save()
        #     return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
        # else:
        #     return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
