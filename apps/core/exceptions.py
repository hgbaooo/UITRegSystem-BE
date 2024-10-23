# core/exceptions.py
from rest_framework.exceptions import APIException

class ApiError(APIException):
    status_code = None
    default_detail = 'A server error occurred.'
    default_code = 'error'

    def __init__(self, status_code, detail=None, code=None):
        self.status_code = status_code
        if detail is not None:
            self.detail = detail
        if code is not None:
            self.code = code
