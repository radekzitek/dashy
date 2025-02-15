import logging
import json
from django.utils.deprecation import MiddlewareMixin

# Get the logger for 'django.request'
logger = logging.getLogger("django.request")


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log every incoming request with support for all HTTP methods,
    handling of different content types and encodings.
    """

    def process_request(self, request):
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

            # Build the log message. For better readability, format dictionaries as JSON.
            log_message = (
                f"Incoming Request:\n"
                f"Method: {method}\n"
                f"Path: {full_path}\n"
                f"Headers: {json.dumps(headers, indent=2)}\n"
                f"GET Data: {json.dumps(get_data, indent=2)}\n"
                f"POST Data: "
            )

            # If post_data is a dict, convert to JSON; otherwise, log as is.
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
        # Continue processing the request as usual
        return None
