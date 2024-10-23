# apps/user/api/v1/urls.py

from django.urls import path
from .views import CreateUserView, UserDetailView, UserListView, GetUserView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/create-user/', CreateUserView.as_view(), name='user-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<int:pk>/retrieve/', GetUserView.as_view(), name='user-retrieve'),
]
