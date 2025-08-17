from django.urls import path
from .views import RegisterView, CustomAuthToken, DoctorListView, AppointmentCreateView, AppointmentListView, UserProfileView, VerifyOTPView, AvailableSlotsView, SlotListAPIView, LeaveListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('doctors/', DoctorListView.as_view(), name='doctors'),
    path('appointments/', AppointmentListView.as_view(), name='appointments'),
    path('appointments/create/', AppointmentCreateView.as_view(), name='create-appointment'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),  
    path('available-slots/', AvailableSlotsView.as_view(), name='available-slots'),
    path('slots/', SlotListAPIView.as_view(), name='slot-list'),
    path('leaves/', LeaveListView.as_view(), name='leaves-list'),
    
    
]
