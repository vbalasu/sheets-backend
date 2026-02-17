"""CLI: validate a JWT from stdin. Backend API is in app.py (Chalice)."""
import os
from app import validate_jwt

AUDIENCE = os.environ.get("AUDIENCE", "https://example.com")

if __name__ == "__main__":
    token = input("Enter the JWT: ")
    print(validate_jwt(token, AUDIENCE))
