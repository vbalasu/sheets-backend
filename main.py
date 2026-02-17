from google.oauth2 import id_token
from google.auth.transport import requests

def validate_jwt(token: str, audience: str):
    """
    Validates a Google-issued ID token.
    
    :param token: The JWT string
    :param audience: The expected audience (aud claim)
    :return: Decoded token payload (dict)
    :raises ValueError: If invalid
    """
    return id_token.verify_oauth2_token(
        token,
        requests.Request(),
        audience=audience
    )

def main():
    # Ask for the JWT
    token = input("Enter the JWT: ")
    print(validate_jwt(token, "https://example.com"))

if __name__ == "__main__":
    main()