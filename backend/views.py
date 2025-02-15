from rest_framework import generics, permissions
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    LogEntrySerializer,
    ChangePasswordSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileAPIView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Returns the currently authenticated user
        return self.request.user


class UserProfileUpdateAPIView(generics.UpdateAPIView):
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Return the currently authenticated user
        return self.request.user


class LogEntryAPIView(APIView):
    # Optionally, you might allow any user (even unauthenticated) to log
    permission_classes = []  # AllowAny

    def post(self, request, *args, **kwargs):
        # logger = logging.getLogger("backend_logger")
        # logger.debug(f"Received log entry request: {request.data}")

        # Get the logger (we'll configure it in settings)
        feLogger = logging.getLogger("frontend_logger")

        serializer = LogEntrySerializer(data=request.data)
        if serializer.is_valid():
            # logger.debug(f"Validated data: {serializer.validated_data}")
            data = serializer.validated_data
            level = data.get("level", "INFO")
            message = data.get("message")
            meta = data.get("meta", {})

            # Log the message using the appropriate log level.
            if level == "DEBUG":
                feLogger.debug(message, extra={"meta": meta})
            elif level == "INFO":
                feLogger.info(message, extra={"meta": meta})
            elif level == "WARNING":
                feLogger.warning(message, extra={"meta": meta})
            elif level == "ERROR":
                feLogger.error(message, extra={"meta": meta})
            elif level == "CRITICAL":
                feLogger.critical(message, extra={"meta": meta})

            # logger.debug(f"Logged message: {message}")
            return Response({"status": "logged"}, status=status.HTTP_200_OK)
        else:
            # logger.warning(f"Invalid data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger = logging.getLogger("backend_logger")
        logger.debug(f"Received password change request: {request.data}")
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():  # Validate the serializer
            #  validated
            logger.debug(f"Validated data: {serializer.validated_data}")
            # logger.debug(f"old_password: {serializer.validated_data["old_password"]}")
            # logger.debug(f"new_password: {serializer.validated_data["new_password"]}")
            if not request.user.check_password(
                serializer.validated_data["old_password"]
            ):  # Check if the old password is correct
                # not correct
                logger.warning(
                    f"Invalid old password: {serializer.validated_data["old_password"]}"
                )
                return Response(
                    {"current_password": ["Current password is incorrect."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:  # correct
                new_password = serializer.validated_data["new_password"]
                request.user.set_password(new_password)
                request.user.save()
                return Response(
                    {"detail": "Password changed successfully."},
                    status=status.HTTP_200_OK,
                )
        else:  # invalid
            logger.warning(f"Invalid data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
