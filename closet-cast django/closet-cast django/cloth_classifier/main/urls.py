from django.urls import path
from . import views
from .views import login_view, logout_view, dashboard,register_view,home_view,add_outfit,delete_outfit
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [     # Home page with image upload
    path('', login_view, name='home'),
    path('predict/', views.predict, name='predict'),  # Prediction endpoint
    path('index/', views.index, name='index'),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("register/", register_view, name="register"),
    path("dashboard/", dashboard, name="dashboard"),
    path("home/", home_view, name="home_page"),
    path('add/', views.add_outfit, name='add_outfit'),
    path("delete/<int:pk>/", views.delete_outfit, name="delete_outfit")
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
