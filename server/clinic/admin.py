from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User as DefaultUser
from .models import Doctor, Slot, Leave, Appointment, CustomUser

try:
    admin.site.unregister(DefaultUser)
except admin.sites.NotRegistered:
    pass
class CustomUserAdmin(UserAdmin):
    # Add your custom fields to the list of displayed fields
    list_display = UserAdmin.list_display + ('is_verified',)
    
    # Add your custom fields to the form fieldsets for editing
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('OTP Information', {'fields': ('otp', 'otp_created_at', 'is_verified')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

admin.site.register(CustomUser, UserAdmin)

admin.site.register(Doctor)
admin.site.register(Slot)
admin.site.register(Leave)
admin.site.register(Appointment)


# Register your models here.
