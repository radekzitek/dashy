from rest_framework import generics, permissions
from .serializers import UserRegistrationSerializer, UserProfileSerializer


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileAPIView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Returns the currently authenticated user
        return self.request.user
