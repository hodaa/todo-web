import logging
from typing import Dict


logger = logging.getLogger("todo.request")


SENSITIVE_HEADERS = {"authorization", "cookie", "set-cookie"}


def _scrub_headers(headers: Dict[str, str]) -> Dict[str, str]:
    scrubbed = {}
    for key, value in headers.items():
        lower_key = key.lower()
        if lower_key in SENSITIVE_HEADERS:
            scrubbed[key] = "[REDACTED]"
        else:
            scrubbed[key] = value
    return scrubbed


class RequestResponseLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            user_id = getattr(getattr(request, "user", None), "id", None)
        except Exception:
            user_id = None

        headers = ({k: v for k, v in request.headers.items()}
                   if hasattr(request, "headers")
                   else {})
        headers = _scrub_headers(headers)

        logger.info(
            "request method=%s path=%s query=%s user_id=%s headers=%s",
            request.method,
            request.path,
            request.META.get("QUERY_STRING", ""),
            user_id,
            headers,
        )

        response = self.get_response(request)

        resp_headers = {k: v for k, v in response.items()}
        resp_headers = _scrub_headers(resp_headers)

        logger.info(
            "response method=%s path=%s status=%s content_length=%s "
            "headers=%s",
            request.method,
            request.path,
            getattr(response, "status_code", None),
            response.get("Content-Length",
                         len(getattr(response, "content", b""))
                         if hasattr(response, "content") else None),
            resp_headers,
        )

        return response
