#!/usr/bin/env bash
# Call the backend /data endpoint with a Google identity token.
# Requires: gcloud CLI, a service account key file.
#
# Usage:
#   ./test-backend.sh [KEY_FILE] [SHEET_NAME]
# Or set env: BACKEND_URL, KEY_FILE, SHEET_NAME
#
# Example:
#   KEY_FILE=./service-account-cloudmatica-sheets.json ./test-backend.sh
#   ./test-backend.sh ./path/to-key.json Sheet1

set -e

BACKEND_URL="${BACKEND_URL:-https://2rmhh3n645.execute-api.us-east-1.amazonaws.com/api}"
KEY_FILE="${1:-${KEY_FILE:-service-account-cloudmatica-sheets.json}}"
SHEET_NAME="${2:-${SHEET_NAME:-Sheet1}}"
BASE_URL="${BACKEND_URL%/}"

if [[ ! -f "$KEY_FILE" ]]; then
  echo "Key file not found: $KEY_FILE" >&2
  echo "Set KEY_FILE or pass it as the first argument." >&2
  exit 1
fi

# Activate the service account and get an identity token with audience = backend URL
# (so the backend can validate it)
export GOOGLE_APPLICATION_CREDENTIALS="$KEY_FILE"
SA_EMAIL=$(grep -o '"client_email"[[:space:]]*:[[:space:]]*"[^"]*"' "$KEY_FILE" | sed 's/.*"\([^"]*\)".*/\1/')
TOKEN=$(gcloud auth print-identity-token \
  --impersonate-service-account="$SA_EMAIL" \
  --audiences="$BASE_URL" \
  2>/dev/null || {
  # Fallback: activate with key file and print identity token (no impersonation)
  gcloud auth activate-service-account --key-file="$KEY_FILE" --quiet
  gcloud auth print-identity-token --audiences="$BASE_URL"
})

ENCODED_SHEET=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$SHEET_NAME")
curl -sS -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/data?sheet_name=$ENCODED_SHEET"
echo
