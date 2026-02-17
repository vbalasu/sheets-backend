import os
from typing import Any

from chalice import Chalice, UnauthorizedError
from google.oauth2 import id_token
from google.auth.transport import requests

app = Chalice(app_name="sheets-backend")

# Must match target_audience when obtaining the token in Sheets (BACKEND_URL).
# Set in .chalice/config.json or env (e.g. API Gateway invoke URL).
AUDIENCE = os.environ.get("AUDIENCE", "https://example.com")


def validate_jwt(token: str, audience: str) -> dict[str, Any]:
    """Validate a Google-issued ID token."""
    return id_token.verify_oauth2_token(
        token,
        requests.Request(),
        audience=audience,
    )


def get_data_for_sheet(sheet_name: str) -> dict[str, Any]:
    """Return data for the given sheet name. Replace with real logic as needed."""
    return {
        "sheet_name": sheet_name,
        "rows": [
            ["Column A", "Column B", "Column C"],
            [sheet_name, "value", "data"],
        ],
    }


@app.route("/data", methods=["GET"])
def get_data() -> dict[str, Any]:
    """Fetch data for the given sheet name. Requires Bearer JWT."""
    auth = app.current_request.headers.get("Authorization") or app.current_request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise UnauthorizedError("Missing or invalid Authorization header")
    token = auth[7:].strip()

    sheet_name = (app.current_request.query_params or {}).get("sheet_name")
    if not sheet_name:
        raise UnauthorizedError("Missing query parameter: sheet_name")

    try:
        validate_jwt(token, AUDIENCE)
    except ValueError as e:
        raise UnauthorizedError(str(e))

    return get_data_for_sheet(sheet_name)
