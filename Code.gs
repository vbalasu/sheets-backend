// getIdToken() is defined in Auth.gs
// getDataForCurrentSheet() is defined in Data.gs

/**
 * Adds a custom menu when the spreadsheet opens.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Backend')
    .addItem('Refresh sheet from backend', 'refreshCurrentSheetFromBackend')
    .addToUi();
}

/**
 * Fetches data for the current sheet from the backend and writes it to the sheet.
 */
function refreshCurrentSheetFromBackend() {
  const data = getDataForCurrentSheet();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = data.rows || [];
  if (rows.length === 0) {
    sheet.clear();
    return;
  }
  const numRows = rows.length;
  const numCols = Math.max(...rows.map(function (r) { return r.length; }), 1);
  const padded = rows.map(function (r) {
    var row = r.slice();
    while (row.length < numCols) row.push('');
    return row;
  });
  sheet.getRange(1, 1, numRows, numCols).setValues(padded);
}
