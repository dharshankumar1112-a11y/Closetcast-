from django.contrib import admin
from .models import User, Collection, Outfit, Order
# Register your models here.
admin.site.register(User)
admin.site.register(Collection)
admin.site.register(Outfit)
admin.site.register(Order)