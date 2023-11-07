from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Users)
admin.site.register(Organizations)
admin.site.register(Roles)
admin.site.register(Todos)
