/** Coordinator Dashboard - Apps Script JSON API (read-only on your sheet) */
const SS_ID = '1HDgE8cLdW5U0EYOCT9oo7eJotWNY8LY19omcHe5LT8s';
const GID = 1620728198;
const TZ = 'Asia/Kolkata';
const P = () => PropertiesService.getScriptProperties();

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  try { return json_(getData_()); }
  catch (err) { return json_({ error: String(err.message || err) }); }
}

// Targets save. Body is JSON sent as text/plain: {pin, settings}
function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    const real = P().getProperty('ADMIN_PIN');
    if (!real) throw new Error('ADMIN_PIN is not configured in Script Properties.');
    if (String(b.pin) !== real) throw new Error('Invalid admin PIN.');
    P().setProperty('TARGETS', JSON.stringify(b.settings));
    return json_({ ok: true });
  } catch (err) { return json_({ error: String(err.message || err) }); }
}

function getData_() {
  const sh = SpreadsheetApp.openById(SS_ID).getSheets().filter(s => s.getSheetId() === GID)[0];
  if (!sh) throw new Error('Sheet with gid ' + GID + ' not found');
  const v = sh.getDataRange().getValues();
  const headers = v.shift().map(String);
  const rows = v.filter(r => r.some(c => c !== '')).map(r => r.map(c =>
    c instanceof Date ? Utilities.formatDate(c, TZ, "yyyy-MM-dd'T'HH:mm:ss") : c));
  const now = new Date();
  return {
    headers: headers, rows: rows,
    today: Utilities.formatDate(now, TZ, 'yyyy-MM-dd'),
    updated: Utilities.formatDate(now, TZ, 'dd MMM yyyy, hh:mm a'),
    lastSync: P().getProperty('LAST_SYNC') || '',
    settings: JSON.parse(P().getProperty('TARGETS') || '{"daily":{},"monthly":{},"cat":{}}')
  };
}

/** Run once from the editor: creates the form-submit trigger. */
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'onFormSubmit') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(SS_ID).onFormSubmit().create();
}
function onFormSubmit() {
  P().setProperty('LAST_SYNC', Utilities.formatDate(new Date(), TZ, 'dd MMM yyyy, hh:mm a'));
}
