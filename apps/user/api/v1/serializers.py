from rest_framework import serializers
from apps.user.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'fullname', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            fullname=validated_data['fullname'],
            email=validated_data['email']
        )
        # Call the set_password method to hash the password
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        # Handle password updating if provided
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
            validated_data.pop('password')  # Remove password from validated_data

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
