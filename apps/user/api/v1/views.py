# apps/user/api/v1/views.py

from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from apps.user.models import User
from .serializers import UserSerializer
from drf_yasg.utils import swagger_auto_schema
from apps.core.exceptions import ApiError

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @swagger_auto_schema(
        operation_description="Create a new user with username, email, and password",
        request_body=UserSerializer,
        responses={201: UserSerializer()},
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            raise ApiError(status.HTTP_400_BAD_REQUEST, str(e))


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @swagger_auto_schema(
        operation_description="Retrieve user details by ID",
        responses={
            200: UserSerializer(),
            404: "User not found"
        }
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except User.DoesNotExist:
            raise ApiError(status.HTTP_404_NOT_FOUND, "User not found")
        except Exception as e:
            raise ApiError(status.HTTP_500_INTERNAL_SERVER_ERROR, "Failed to retrieve user details")

    @swagger_auto_schema(
        operation_description="Update a user's full name, email, and password by ID",
        request_body=UserSerializer,
        responses={
            200: UserSerializer(),
            400: "Invalid input",
            404: "User not found"
        }
    )
    def put(self, request, *args, **kwargs):
        try:
            return super().put(request, *args, **kwargs)
        except User.DoesNotExist:
            raise ApiError(status.HTTP_404_NOT_FOUND, "User not found")
        except Exception as e:
            raise ApiError(status.HTTP_400_BAD_REQUEST, str(e))

    @swagger_auto_schema(
        operation_description="Delete a user by ID",
        responses={
            204: "User deleted",
            404: "User not found"
        }
    )
    def delete(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            raise ApiError(status.HTTP_404_NOT_FOUND, "User not found")
        except Exception as e:
            raise ApiError(status.HTTP_500_INTERNAL_SERVER_ERROR, "Failed to delete user")


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @swagger_auto_schema(
        operation_description="Get a list of all users",
        responses={200: UserSerializer(many=True)},
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception:
            raise ApiError(status.HTTP_500_INTERNAL_SERVER_ERROR, "Failed to retrieve users")


class GetUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @swagger_auto_schema(
        operation_description="Retrieve a user by ID",
        responses={200: UserSerializer(), 404: "User not found"},
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except User.DoesNotExist:
            raise ApiError(status.HTTP_404_NOT_FOUND, "User not found")
        except Exception:
            raise ApiError(status.HTTP_500_INTERNAL_SERVER_ERROR, "Failed to retrieve user details")
