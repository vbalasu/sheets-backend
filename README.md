# sheets-backend

This is how you can authenticate to a Google Cloud project (cloudmatica) using a service account (sheets@cloudmatica.iam.gserviceaccount.com).

Google Sheet: [sheets-backend](https://docs.google.com/spreadsheets/d/1TJ_1mrYbJbS5t4I3bdNK27yD8MD_Dmue6hnHZEttOwM/edit?gid=0#gid=0)

### Step 1: Generate JWT in Google Sheets

Set script properties

![script-properties.png](media/script-properties.png)

[Code.gs](Code.gs)

### Step 2: Validate the JWT in the Python Backend

[main.py](main.py)
