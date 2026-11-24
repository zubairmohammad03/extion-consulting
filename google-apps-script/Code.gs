/**
 * Saves enquiries from the Extion Consulting website into this Google Sheet.
 *
 * Setup (once): in the sheet, Extensions > Apps Script, paste this file,
 * then Deploy > New deployment > Web app, with
 *   Execute as: Me
 *   Who has access: Anyone
 * and put the Web app URL in FORM_ENDPOINT at the top of js/main.js.
 */

const SHEET_NAME = "Sheet1";

// Sheet column headers, and the website form field that fills each one.
const COLUMNS = [
  ["Timestamp", null],
  ["Name", "name"],
  ["Email", "email"],
  ["Phone", "phone"],
  ["Company", "company"],
  ["Position", "position"],
  ["Message", "topic"],
  ["Source", "source"],
  ["Page", "page"],
];

function doPost(e) {
  const params = (e && e.parameter) || {};

  // Spam bots fill in the hidden "website" field; people never see it.
  if (params.website) return json({ ok: true });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS.map(([header]) => header));
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(COLUMNS.map(([, field]) => (field ? clean(params[field]) : new Date())));
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the Web app URL in a browser shows this, to confirm it's deployed.
function doGet() {
  return ContentService.createTextOutput("Extion Consulting form endpoint is running.");
}

// Keeps values as plain text, so input like "=HYPERLINK(...)" or "+91 ..."
// isn't treated as a formula or number.
function clean(value) {
  const text = String(value || "").trim().slice(0, 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
