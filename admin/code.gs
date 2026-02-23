// ================================================================
// SADGURU SAINATH DRIVING SCHOOL — GOOGLE APPS SCRIPT BACKEND
// admin/code.gs
//
// SETUP STEPS:
// 1. Open script.google.com  →  New project
// 2. Delete existing code, paste ALL of this file
// 3. Change SPREADSHEET_ID below to your Google Sheet's ID
// 4. Click Run → setupAllSheets  (creates all tabs with headers)
// 5. Click Deploy → New deployment → Web App
//    Execute as: Me  |  Who has access: Anyone
// 6. Copy the Web App URL → paste into admin-dashboard.js CONFIG
// ================================================================

// ── Your Google Sheet ID (from the URL) ──
// https://docs.google.com/spreadsheets/d/  THIS_PART  /edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';  // ← replace this

// Sheet tab names
const SHEET_NAMES = {
  students:    'Students',
  attendance:  'Attendance',
  payments:    'Payments',
  enquiries:   'Enquiries',
  services:    'RTO_Services',
  fleet:       'Fleet',
  instructors: 'Instructors',
};

// Column headers for each sheet (auto-created on first use)
const HEADERS = {
  Students:     ['Name', 'Phone', 'Course', 'Instructor', 'Start Date',
                 'Total Fee (₹)', 'Fee Paid (₹)', 'Address', 'Notes', 'Added On'],
  Attendance:   ['Date', 'Student Name', 'Instructor', 'Status', 'Training Day',
                 'Car Used', 'Notes', 'Logged On'],
  Payments:     ['Date', 'Student Name', 'Amount (₹)', 'Payment Mode', 'Payment Type',
                 'Receipt No.', 'Notes', 'Logged On'],
  Enquiries:    ['Date', 'Name', 'Phone', 'Source', 'Course Interest',
                 'Status', 'Notes', 'Logged On'],
  RTO_Services: ['Date', 'Customer Name', 'Phone', 'Service Type', 'DL/Vehicle No.',
                 'Service Fee (₹)', 'Amount Paid (₹)', 'Status', 'Expected Date',
                 'Handled By', 'Notes', 'Logged On'],
  Fleet:        ['Date', 'Car', 'Instructor', 'Hours', 'Fuel (L)',
                 'Fuel Cost (₹)', 'Issue Status', 'Odometer (km)', 'Notes', 'Logged On'],
  Instructors:  ['Date', 'Instructor', 'Students Handled', 'Hours Worked',
                 'Session Summary', 'Logged On'],
};

// ----------------------------------------------------------------
// GET — Read all rows from a sheet
// ----------------------------------------------------------------
function doGet(e) {
  try {
    const sheetName = e.parameter.sheet;
    const action    = e.parameter.action;

    if (action === 'read' && sheetName) {
      const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = getOrCreateSheet(ss, sheetName);
      const data  = sheet.getDataRange().getValues();
      const rows  = data.length > 1 ? data.slice(1) : [];

      return jsonOut({ success: true, data: rows });
    }

    return jsonOut({ success: false, error: 'Invalid request' });

  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

// ----------------------------------------------------------------
// POST — Append a new row to a sheet
// ----------------------------------------------------------------
function doPost(e) {
  try {
    const body      = JSON.parse(e.postData.contents);
    const sheetName = body.sheet;
    const action    = body.action;
    const rowData   = body.data;

    if (action === 'append' && sheetName && Array.isArray(rowData)) {
      const ss        = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet     = getOrCreateSheet(ss, sheetName);
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      sheet.appendRow([...rowData, timestamp]);

      return jsonOut({ success: true, message: 'Row added to ' + sheetName });
    }

    return jsonOut({ success: false, error: 'Invalid action or data' });

  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

// ----------------------------------------------------------------
// Helper — Get or create a sheet with headers
// ----------------------------------------------------------------
function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = HEADERS[name];
    if (headers && headers.length) {
      const range = sheet.getRange(1, 1, 1, headers.length);
      range.setValues([headers]);
      range.setBackground('#1a1a2e');
      range.setFontColor('#ffffff');
      range.setFontWeight('bold');
      range.setFontSize(11);
      sheet.setFrozenRows(1);
      headers.forEach((_, i) => sheet.autoResizeColumn(i + 1));
    }
  }

  return sheet;
}

// ----------------------------------------------------------------
// Helper — JSON response
// ----------------------------------------------------------------
function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ----------------------------------------------------------------
// SETUP — Run once manually to create all sheet tabs
// In Apps Script editor: click Run → setupAllSheets
// ----------------------------------------------------------------
function setupAllSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Create all data sheets
  Object.values(SHEET_NAMES).forEach(name => getOrCreateSheet(ss, name));

  // Rename the default Sheet1 to a notes sheet
  const def = ss.getSheetByName('Sheet1');
  if (def) {
    def.setName('_Notes');
    def.getRange('A1').setValue('Sadguru Sainath Driving School — Admin Data').setFontWeight('bold').setFontSize(14);
    def.getRange('A2').setValue('DO NOT DELETE the sheets below. They are connected to your website admin panel.');
    def.getRange('A3').setValue('Sheets: Students | Attendance | Payments | Enquiries | RTO_Services | Fleet | Instructors');
  }

  SpreadsheetApp.getUi().alert('✅ All 7 sheets created! Your Google Sheet is ready to use.');
}