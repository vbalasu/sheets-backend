// getDataForCurrentSheet() calls the Python backend (Auth.gs for token).
// Requires script property BACKEND_URL, e.g. https://your-service-xxxx.run.app (no trailing slash).

/**
 * Fetches data from the backend for the currently active sheet.
 * @return {Object} Response from backend, e.g. { sheet_name: string, rows: string[][] }
 */
function getDataForCurrentSheet() {
  const props = PropertiesService.getScriptProperties();
  const baseUrl = props.getProperty('BACKEND_URL');
  if (!baseUrl) {
    throw new Error('Script property BACKEND_URL is not set');
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const sheetName = sheet.getName();
  const token = getIdToken();

  const url = baseUrl.replace(/\/$/, '') + '/data?sheet_name=' + encodeURIComponent(sheetName);
  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token
    },
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  const text = response.getContentText();
  if (code < 200 || code >= 300) {
    throw new Error('Backend error ' + code + ': ' + text);
  }
  return JSON.parse(text);
}
