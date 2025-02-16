import logging
import json
import time
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

# Get the logger for 'django.request'
logger = logging.getLogger("django.request")


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log every incoming request with support for all HTTP methods,
    handling of different content types and encodings.
    """

    def process_request(self, request):
        if not settings.DEBUG:
            return None

        try:
            # Basic request info
            method = request.method
            full_path = request.get_full_path()

            # Extract headers from META (HTTP_* headers)
            headers = {}
            for key, value in request.META.items():
                if key.startswith("HTTP_"):
                    header_name = key[5:].replace("_", "-").title()
                    headers[header_name] = value
            # Include CONTENT_TYPE and CONTENT_LENGTH if available
            if "CONTENT_TYPE" in request.META:
                headers["Content-Type"] = request.META["CONTENT_TYPE"]
            if "CONTENT_LENGTH" in request.META:
                headers["Content-Length"] = request.META["CONTENT_LENGTH"]

            # GET parameters
            get_data = dict(request.GET)

            # Initialize variables for POST/PUT/PATCH/DELETE data
            post_data = {}
            files_data = {}
            raw_body = ""

            if method in ["POST", "PUT", "PATCH", "DELETE"]:
                if request.content_type and request.content_type.startswith(
                    "multipart"
                ):
                    # For multipart/form-data (typically file uploads)
                    post_data = dict(request.POST)
                    files_data = {
                        key: [file.name for file in files]
                        for key, files in request.FILES.lists()
                    }
                else:
                    # For other content types (application/json, text, etc.)
                    try:
                        encoding = request.encoding or "utf-8"
                        raw_body = request.body.decode(encoding)
                    except Exception as decode_error:
                        raw_body = f"<failed to decode body: {decode_error}>"

                    # If JSON, attempt to parse the raw body
                    if (
                        request.content_type
                        and "application/json" in request.content_type
                    ):
                        try:
                            post_data = json.loads(raw_body)
                        except Exception as json_error:
                            post_data = f"<failed to parse JSON: {json_error}>"
                    else:
                        post_data = raw_body

            # Build the log message
            log_message = (
                f"Incoming Request:\n"
                f"Method: {method}\n"
                f"Path: {full_path}\n"
                f"Headers: {json.dumps(headers, indent=2)}\n"
                f"GET Data: {json.dumps(get_data, indent=2)}\n"
                f"POST Data: "
            )

            # If post_data is a dict, convert to JSON; otherwise, log as is
            if isinstance(post_data, dict):
                log_message += f"{json.dumps(post_data, indent=2)}\n"
            else:
                log_message += f"{post_data}\n"

            # Add files data to the log message
            log_message += f"Files: {json.dumps(files_data, indent=2)}\n"

            # Log the complete request info at INFO level
            logger.info(log_message)
        except Exception as e:
            # If any error occurs while logging, log the error without breaking the request flow
            logger.error(f"Error logging request: {e}")

        return None


class ResponseLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log every outgoing response with timing information,
    status codes, and response content (where appropriate).
    """

    def process_request(self, request):
        # Always store the start time, even if not debugging,
        # as it's needed for the response timing
        request.start_time = time.time()
        return None

    def process_response(self, request, response):
        if not settings.DEBUG:
            return response

        try:
            # Calculate request duration
            duration = time.time() - getattr(request, "start_time", time.time())

            # Basic response info
            status_code = response.status_code
            content_type = response.get("Content-Type", "unknown")
            content_length = response.get("Content-Length", "unknown")

            # Get response content based on content type
            response_content = ""
            if hasattr(response, "content"):
                if "application/json" in content_type:
                    try:
                        # Try to parse and format JSON response
                        response_content = json.loads(response.content.decode("utf-8"))
                        response_content = json.dumps(response_content, indent=2)
                    except Exception as json_error:
                        response_content = f"<failed to parse JSON: {json_error}>"
                elif "text" in content_type:
                    try:
                        # For text responses, decode the content
                        response_content = response.content.decode("utf-8")
                    except Exception as decode_error:
                        response_content = f"<failed to decode content: {decode_error}>"
                else:
                    response_content = "<binary content>"

            # Build headers dictionary
            headers = {key: value for key, value in response.items()}

            # Build the log message
            log_message = (
                f"Outgoing Response:\n"
                f"Duration: {duration:.3f}s\n"
                f"Status Code: {status_code}\n"
                f"Content-Type: {content_type}\n"
                f"Content-Length: {content_length}\n"
                f"Headers: {json.dumps(headers, indent=2)}\n"
            )

            # Add response content to log if it exists
            if response_content:
                log_message += f"Content: {response_content}\n"

            # Log at appropriate level based on status code
            if status_code >= 500:
                logger.error(log_message)
            elif status_code >= 400:
                logger.warning(log_message)
            else:
                logger.info(log_message)

        except Exception as e:
            # If any error occurs while logging, log the error without breaking the response flow
            logger.error(f"Error logging response: {e}")

        # Always return the response
        return response
