// ================================================================
// SADGURU SAINTAH DRIVING SCHOOL — GOOGLE APPS SCRIPT BACKEND
// ================================================================
// HOW TO USE:
// 1. Open your Google Sheet
// 2. Click Extensions → Apps Script
// 3. Delete any existing code, paste ALL of this code in
// 4. Click Save, then Deploy → New Deployment
// 5. Set type: "Web App", Execute as: "Me", Who has access: "Anyone"
// 6. Copy the Web App URL and paste it into admin-dashboard.js CONFIG
// ================================================================

// Sheet tab names — must match exactly
const SHEET_NAMES = {
  students:    'Students',
  attendance:  'Attendance',
  payments:    'Payments',
  enquiries:   'Enquiries',
  fleet:       'Fleet',
  instructors: 'Instructors',
};

// Column headers for each sheet (auto-created on first use)
const HEADERS = {
  Students:    ['Name', 'Phone', 'Course', 'Instructor', 'Start Date', 'Total Fee (₹)', 'Fee Paid (₹)', 'Address', 'Notes', 'Added On'],
  Attendance:  ['Date', 'Student Name', 'Instructor', 'Status', 'Training Day', 'Car Used', 'Notes', 'Logged On'],
  Payments:    ['Date', 'Student Name', 'Amount (₹)', 'Payment Mode', 'Payment Type', 'Receipt No.', 'Notes', 'Logged On'],
  Enquiries:   ['Date', 'Name', 'Phone', 'Source', 'Course Interest', 'Status', 'Notes', 'Logged On'],
  Fleet:       ['Date', 'Car', 'Instructor', 'Hours', 'Fuel (L)', 'Fuel Cost (₹)', 'Issue Status', 'Odometer (km)', 'Notes', 'Logged On'],
  Instructors: ['Date', 'Instructor', 'Students Handled', 'Hours Worked', 'Session Summary', 'Logged On'],
};

// ----------------------------------------------------------------
// GET — Read data from a sheet
// ----------------------------------------------------------------
function doGet(e) {
  try {
    const sheetName = e.parameter.sheet;
    const action    = e.parameter.action;

    if (action === 'read' && sheetName) {
      const ss    = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = getOrCreateSheet(ss, sheetName);
      const data  = sheet.getDataRange().getValues();

      // Skip header row (row 0), return rest
      const rows = data.length > 1 ? data.slice(1) : [];

      return ContentService
        .createTextOutput(JSON.stringify({ success: true, data: rows }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Invalid request' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
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
      const ss    = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = getOrCreateSheet(ss, sheetName);

      // Append timestamp
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      sheet.appendRow([...rowData, timestamp]);

      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Row added to ' + sheetName }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Invalid action or data' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ----------------------------------------------------------------
// HELPER — Get existing sheet or create with headers
// ----------------------------------------------------------------
function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = HEADERS[name];
    if (headers) {
      // Write header row with formatting
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setBackground('#1a1a2e');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 120);

      // Auto-resize all columns
      headers.forEach((_, i) => sheet.autoResizeColumn(i + 1));
    }
  }

  return sheet;
}

// ----------------------------------------------------------------
// SETUP — Run this once manually to create all sheet tabs
// (Click Run → setupAllSheets in Apps Script editor)
// ----------------------------------------------------------------
function setupAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.values(SHEET_NAMES).forEach(name => {
    getOrCreateSheet(ss, name);
  });

  // Optionally rename the first/default sheet
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    defaultSheet.setName('_Dashboard_Notes');
    defaultSheet.getRange('A1').setValue('Sadguru Sainath Driving School — Admin Data');
    defaultSheet.getRange('A2').setValue('DO NOT DELETE any sheets below. They are connected to your website admin panel.');
    defaultSheet.getRange('A1').setFontWeight('bold').setFontSize(14);
  }

  SpreadsheetApp.getUi().alert('✅ All 6 sheets created successfully! Your Google Sheet is ready.');
}
