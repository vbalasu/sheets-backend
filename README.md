# sheets-backend

This is how you can authenticate to a Google Cloud project (cloudmatica) using a service account (sheets@cloudmatica.iam.gserviceaccount.com).

Google Sheet: [sheets-backend](https://docs.google.com/spreadsheets/d/1TJ_1mrYbJbS5t4I3bdNK27yD8MD_Dmue6hnHZEttOwM/edit?gid=0#gid=0)

### Step 1: Generate JWT in Google Sheets

Set script properties

![script-properties.png](media/script-properties.png)

[Code.gs](Code.gs)

### Step 2: Validate the JWT in the Python Backend

[main.py](main.py)

### Step 3: Fetch data by sheet name

[Data.gs](Data.gs) calls the Python backend with the current sheet name and returns the response (e.g. `{ sheet_name, rows }`). Set script property **BACKEND_URL** to your deployed API URL (no trailing slash). The backend expects `GET /data?sheet_name=...` with `Authorization: Bearer <id_token>`.

---

## Deploying the Python backend (AWS Lambda with Chalice)

The backend is a [Chalice](https://aws.github.io/chalice/) app that runs on API Gateway + Lambda. No Docker required.

### Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/) installed and configured (`aws configure`)
- [uv](https://docs.astral.sh/uv/) and Python 3.12

### Deploy

1. **Install dependencies and deploy**
   ```bash
   uv sync
   uv export --no-dev --format requirements-txt --output-file requirements.txt
   uv run chalice deploy
   ```
   `uv export` generates `requirements.txt` from `pyproject.toml` for Chalice’s Lambda packaging (the file is gitignored). Chalice then creates the Lambda and API Gateway and prints the API URL, e.g.:
   `https://xxxxxx.execute-api.us-east-1.amazonaws.com/api`

2. **Set the audience and Sheet config**
   - In **.chalice/config.json**, set `AUDIENCE` for your stage to the **exact** API URL (no trailing slash), e.g. `https://xxxxxx.execute-api.us-east-1.amazonaws.com/api`. Then redeploy:
     ```bash
     uv run chalice deploy
     ```
   - In the Google Sheet script properties, set **BACKEND_URL** to that same URL (no trailing slash).

### Local development

```bash
uv sync
uv run chalice local
```

Then call `http://localhost:8000/data?sheet_name=MySheet` with a Bearer token. For the Sheet to use this you’d expose it via a tunnel (e.g. ngrok) and set **BACKEND_URL** and **AUDIENCE** to the tunnel URL.

### Script properties summary

| Property       | Description |
|----------------|-------------|
| SA_EMAIL       | Service account email |
| SA_PRIVATE_KEY | Private key (full PEM, escaped newlines as `\n`) |
| BACKEND_URL    | Backend base URL, e.g. `https://xxxxxx.execute-api.us-east-1.amazonaws.com/api` (also used as JWT audience) |
