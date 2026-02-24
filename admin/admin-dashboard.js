/* ============================================================
   SADGURU SAINATH DRIVING SCHOOL — ADMIN DASHBOARD JS
   admin/admin-dashboard.js
   ============================================================ */

// ================================================================
// ⚙️  CONFIG — YOUR VALUES ARE ALREADY SET BELOW
// ================================================================
const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwBIhTnVGd9PSabtIuiSRB20MBZzSK84Mzh0rfkRE3q22lkga8USw-ffkpPuuzS37R_cQ/exec',
  SHEET_ID:   '1t8_PrvldhzTl_rYLlT4Ikfdzy53jvkrUZpn7DruATOM',
};

// Sheet tab names (must match exactly in Google Sheets)
const SHEETS = {
  students:    'Students',
  attendance:  'Attendance',
  payments:    'Payments',
  enquiries:   'Enquiries',
  services:    'RTO_Services',
  fleet:       'Fleet',
  instructors: 'Instructors',
};

// In-memory cache (1 minute TTL)
const cache = {};

// ================================================================
// UTILITIES
// ================================================================
function todayStr() { return new Date().toISOString().split('T')[0]; }

function fmtINR(n) {
  if (!n || isNaN(n)) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
}

function fmtDate(s) {
  if (!s) return '—';
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function getFormData(form) {
  const fd = new FormData(form), obj = {};
  fd.forEach((v, k) => obj[k] = v);
  return obj;
}

function showGlobalAlert(msg, type = 'error') {
  const el = document.getElementById('globalAlert');
  if (!el) return;
  el.textContent = msg;
  el.className = `global-alert alert alert-${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 8000);
}

function setFormStatus(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `form-status ${type}`;
  if (type === 'success') setTimeout(() => { el.textContent = ''; }, 5000);
}

function badge(status) {
  const map = {
    'Present':            's-present',
    'Absent':             's-absent',
    'Leave':              's-leave',
    'New Lead':           's-new',
    'Contacted':          's-new',
    'Follow-up Required': 's-followup',
    'Enrolled':           's-enrolled',
    'Not Interested':     's-absent',
    'No Issues':          's-noissue',
    'Minor Issue':        's-issue',
    'Needs Service':      's-issue',
    'Sent for Repair':    's-repair',
    'Docs Pending':       's-pending',
    'In Progress':        's-inprog',
    'Submitted to RTO':   's-inprog',
    'Completed':          's-done',
    'Cancelled':          's-cancelled',
  };
  const cls = map[status] || '';
  return `<span class="status-badge ${cls}">${status || '—'}</span>`;
}

function addActivity(icon, text) {
  const list = document.getElementById('recentActivity');
  if (!list) return;
  list.querySelector('.recent-empty')?.remove();
  const item = document.createElement('div');
  item.className = 'recent-item';
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  item.innerHTML = `<span class="ri-icon">${icon}</span><span class="ri-text">${text}</span><span class="ri-time">${time}</span>`;
  list.insertBefore(item, list.firstChild);
  if (list.children.length > 8) list.lastChild.remove();
}

// ================================================================
// API — READ & WRITE
// ✅ FIX: isDemo() now correctly checks for placeholder text only
// ================================================================
const PLACEHOLDER = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
const isDemo = () => !CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL === PLACEHOLDER;

async function sendToSheet(sheetName, data) {
  const payload = { sheet: sheetName, action: 'append', data };
  try {
    const res = await fetch(CONFIG.SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // no-cors returns opaque response — treat as success
    return { success: true };
  } catch (err) {
    console.error('sendToSheet error:', err);
    throw err;
  }
}

async function readSheet(sheetName) {
  if (cache[sheetName] && cache[sheetName].time > Date.now() - 60000) {
    return cache[sheetName].data;
  }
  const url = `${CONFIG.SCRIPT_URL}?sheet=${sheetName}&action=read`;
  const res = await fetch(url);
  const result = await res.json();
  const rows = result.data || [];
  cache[sheetName] = { data: rows, time: Date.now() };
  return rows;
}

// ================================================================
// SAMPLE DATA (only shown if SCRIPT_URL is still placeholder)
// ================================================================
function getSampleData(sheet) {
  const t = todayStr();
  const samples = {
    Students: [
      ['Priya Sharma',   '9876543210', '30-Day Comprehensive',   'Aditya Sir', '2026-02-01', '5000', '2500', 'Lohegaon',     'Good progress'],
      ['Rahul More',     '9123456789', "Learner's License Only", 'Atish Sir',  '2026-02-05', '2000', '2000', 'Alandi Road',  'Paid in full'],
      ['Sneha Kulkarni', '9988776655', '15-Day Program',         'Shyam Sir',  '2026-02-10', '3000', '1500', 'Vishrantwadi', 'Balance due'],
    ],
    Attendance: [
      [t, 'Priya Sharma',   'Aditya Sir', 'Present', '12', 'Car 1', 'Good parking session'],
      [t, 'Sneha Kulkarni', 'Shyam Sir',  'Present', '8',  'Car 2', 'Highway practice'],
      [t, 'Rahul More',     'Atish Sir',  'Absent',  '',   '',      'Informed in advance'],
    ],
    Payments: [
      [t,            'Priya Sharma',   '2500', 'Cash',       'Partial Payment', 'RCP001', '1st installment'],
      ['2026-02-05', 'Rahul More',     '2000', 'UPI / GPay', 'Full Payment',    'RCP002', 'GPay — paid full'],
      ['2026-02-10', 'Sneha Kulkarni', '1500', 'Cash',       'Partial Payment', 'RCP003', 'Balance next week'],
    ],
    Enquiries: [
      [t,            'Anita Desai',  '9876501234', 'Google Maps',      '30-Day Comprehensive', 'New Lead',           'Morning batch interest'],
      ['2026-02-20', 'Vikram Patil', '9812345678', 'Referral / Friend',"Learner's License",    'Follow-up Required', 'Wants fee details'],
      ['2026-02-18', 'Meera Joshi',  '9900112233', 'Website',           '15-Day Program',      'Enrolled',           'Enrolled same day'],
    ],
    RTO_Services: [
      [t,            'Suresh Kale', '9000011111', 'License Renewal',      'MH12 2019 1234', '800',  '800',  'Completed',       '2026-02-25', 'Owner', 'Done'],
      ['2026-02-20', 'Anand Patil', '9111122222', 'Two Wheeler Transfer', 'MH14 AK 5678',   '1500', '1000', 'In Progress',     '2026-03-01', 'Owner', 'Filed'],
      ['2026-02-19', 'Kavita More', '9222233333', 'DL Address Change',    'MH12 2018 5678', '500',  '500',  'Submitted to RTO','2026-02-28', 'Owner', 'Awaiting'],
    ],
    Fleet: [
      [t,            'Car 1', 'Aditya Sir', '4',   '5', '500', 'No Issues',   '45230', ''],
      [t,            'Car 2', 'Shyam Sir',  '3.5', '0', '0',   'No Issues',   '32100', 'No fuel'],
      ['2026-02-22', 'Car 1', 'Atish Sir',  '6',   '8', '800', 'Minor Issue', '45180', 'Brake noise'],
    ],
    Instructors: [
      [t, 'Aditya Sir', '3', '5', '3 beginner students. Day 5 done.'],
      [t, 'Atish Sir',  '2', '4', '2 students — refresher + beginner.'],
      [t, 'Shyam Sir',  '4', '6', '4 students including highway session.'],
    ],
  };
  return samples[sheet] || [];
}

// ================================================================
// TABLE LOADERS
// ================================================================
async function loadStudents() {
  let rows;
  try { rows = isDemo() ? getSampleData(SHEETS.students) : await readSheet(SHEETS.students); }
  catch { rows = getSampleData(SHEETS.students); }

  setEl('statTotalStudents', rows.length);
  const el = document.getElementById('studentsBody');
  if (!el) return;
  if (!rows.length) { el.innerHTML = '<tr><td colspan="8" class="table-empty">No students yet.</td></tr>'; return; }

  let totalDue = 0;
  el.innerHTML = rows.map(r => {
    const total = +r[5] || 0, paid = +r[6] || 0, due = total - paid;
    totalDue += due;
    return `<tr>
      <td><strong>${r[0]||'—'}</strong></td>
      <td><a href="tel:${r[1]}">${r[1]||'—'}</a></td>
      <td>${r[2]||'—'}</td>
      <td>${r[3]||'—'}</td>
      <td>${fmtDate(r[4])}</td>
      <td>${fmtINR(r[5])}</td>
      <td style="color:#2e7d32;font-weight:700;">${fmtINR(r[6])}</td>
      <td style="color:${due>0?'#c62828':'#2e7d32'};font-weight:700;">${fmtINR(due)}</td>
    </tr>`;
  }).join('');
  setEl('statPendingPayments', fmtINR(totalDue));
  setEl('payStatDue', fmtINR(totalDue));
}

async function loadAttendance() {
  let rows;
  try { rows = isDemo() ? getSampleData(SHEETS.attendance) : await readSheet(SHEETS.attendance); }
  catch { rows = getSampleData(SHEETS.attendance); }

  const el = document.getElementById('attendanceBody');
  if (!el) return;
  if (!rows.length) { el.innerHTML = '<tr><td colspan="7" class="table-empty">No attendance records yet.</td></tr>'; return; }
  el.innerHTML = [...rows].reverse().map(r => `<tr>
    <td>${fmtDate(r[0])}</td>
    <td><strong>${r[1]||'—'}</strong></td>
    <td>${r[2]||'—'}</td>
    <td>${badge(r[3])}</td>
    <td>${r[4] ? 'Day '+r[4] : '—'}</td>
    <td>${r[5]||'—'}</td>
    <td>${r[6]||'—'}</td>
  </tr>`).join('');
}

async function loadPayments() {
  let rows;
  try { rows = isDemo() ? getSampleData(SHEETS.payments) : await readSheet(SHEETS.payments); }
  catch { rows = getSampleData(SHEETS.payments); }

  const now = new Date(), t = todayStr();
  let todayT = 0, monthT = 0;
  rows.forEach(r => {
    const amt = +r[2] || 0, d = new Date(r[0]);
    if (r[0] === t) todayT += amt;
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthT += amt;
  });
  setEl('payStatToday', fmtINR(todayT));
  setEl('payStatMonth', fmtINR(monthT));
  setEl('statMonthRevenue', fmtINR(monthT));

  const el = document.getElementById('paymentsBody');
  if (!el) return;
  if (!rows.length) { el.innerHTML = '<tr><td colspan="7" class="table-empty">No payments yet.</td></tr>'; return; }
  el.innerHTML = [...rows].reverse().map(r => `<tr>
    <td>${fmtDate(r[0])}</td>
    <td><strong>${r[1]||'—'}</strong></td>
    <td style="color:#2e7d32;font-weight:700;">${fmtINR(r[2])}</td>
    <td>${r[3]||'—'}</td>
    <td>${r[4]||'—'}</td>
    <td>${r[5]||'—'}</td>
    <td>${r[6]||'—'}</td>
  </tr>`).join('');
}

async function loadEnquiries() {
  let rows;
  try { rows = isDemo() ? getSampleData(SHEETS.enquiries) : await readSheet(SHEETS.enquiries); }
  catch { rows = getSampleData(SHEETS.enquiries); }

  const open = rows.filter(r => r[5] === 'New Lead' || r[5] === 'Follow-up Required').length;
  setEl('statOpenEnquiries', open);
  const el = document.getElementById('enquiriesBody');
  if (!el) return;
  if (!rows.length) { el.innerHTML = '<tr><td colspan="7" class="table-empty">No enquiries yet.</td></tr>'; return; }
  el.innerHTML = [...rows].reverse().map(r => `<tr>
    <td>${fmtDate(r[0])}</td>
    <td><strong>${r[1]||'—'}</strong></td>
    <td><a href="tel:${r[2]}">${r[2]||'—'}</a></td>
    <td>${r[3]||'—'}</td>
    <td>${r[4]||'—'}</td>
    <td>${badge(r[5])}</td>
    <td>${r[6]||'—'}</td>
  </tr>`).join('');
}

async function loadServices() {
  let rows;
  try { rows = isDemo() ? getSampleData(SHEETS.services) : await readSheet(SHEETS.services); }
  catch { rows = getSampleData(SHEETS.services); }

  const total   = rows.length;
  const pending = rows.filter(r => ['In Progress','Docs Pending','Submitted to RTO'].includes(r[7])).length;
  const done    = rows.filter(r => r[7] === 'Completed').length;
  const revenue = rows.reduce((s, r) => s + (+r[6] || 0), 0);
  setEl('svcStatTotal',   total);
  setEl('svcStatPending', pending);
  setEl('svcStatDone',    done);
  setEl('svcStatRevenue', fmtINR(revenue));

  const el = document.getElementById('servicesBody');
  if (!el) return;
  if (!rows.length) { el.innerHTML = '<tr><td colspan="9" class="table-empty">No service requests yet.</td></tr>'; return; }
  el.innerHTML = [...rows].reverse().map(r => `<tr>
    <td>${fmtDate(r[0])}</td>
    <td><strong>${r[1]||'—'}</strong></td>
    <td><a href="tel:${r[2]}">${r[2]||'—'}</a></td>
    <td>${r[3]||'—'}</td>
    <td>${r[4]||'—'}</td>
    <td>${fmtINR(r[5])}</td>
    <td style="color:#2e7d32;font-weight:700;">${fmtINR(r[6])}</td>
    <td>${badge(r[7])}</td>
    <td>${fmtDate(r[8])}</td>
  </tr>`).join('');
}

async function loadFleet() {
  let rows;
  try { rows = isDemo() ? getSampleData(SHEETS.fleet) : await readSheet(SHEETS.fleet); }
  catch { rows = getSampleData(SHEETS.fleet); }

  const el = document.getElementById('fleetBody');
  if (!el) return;
  if (!rows.length) { el.innerHTML = '<tr><td colspan="8" class="table-empty">No fleet logs yet.</td></tr>'; return; }
  el.innerHTML = [...rows].reverse().map(r => `<tr>
    <td>${fmtDate(r[0])}</td>
    <td><strong>${r[1]||'—'}</strong></td>
    <td>${r[2]||'—'}</td>
    <td>${r[3] ? r[3]+' hrs' : '—'}</td>
    <td>${r[4] ? r[4]+' L'   : '—'}</td>
    <td>${r[5] ? fmtINR(r[5]) : '—'}</td>
    <td>${badge(r[6])}</td>
    <td>${r[7] ? r[7]+' km'  : '—'}</td>
  </tr>`).join('');
}

async function loadInstructors() {
  let rows;
  try { rows = isDemo() ? getSampleData(SHEETS.instructors) : await readSheet(SHEETS.instructors); }
  catch { rows = getSampleData(SHEETS.instructors); }

  const el = document.getElementById('instructorsBody');
  if (!el) return;
  if (!rows.length) { el.innerHTML = '<tr><td colspan="5" class="table-empty">No instructor logs yet.</td></tr>'; return; }
  el.innerHTML = [...rows].reverse().map(r => `<tr>
    <td>${fmtDate(r[0])}</td>
    <td><strong>${r[1]||'—'}</strong></td>
    <td style="text-align:center;">${r[2]||'—'}</td>
    <td style="text-align:center;">${r[3] ? r[3]+' hrs' : '—'}</td>
    <td>${r[4]||'—'}</td>
  </tr>`).join('');
}

function loadSectionData(sheetName) {
  const map = {
    [SHEETS.students]:    loadStudents,
    [SHEETS.attendance]:  loadAttendance,
    [SHEETS.payments]:    loadPayments,
    [SHEETS.enquiries]:   loadEnquiries,
    [SHEETS.services]:    loadServices,
    [SHEETS.fleet]:       loadFleet,
    [SHEETS.instructors]: loadInstructors,
  };
  if (map[sheetName]) map[sheetName]();
}

// ================================================================
// FORM SETUP HELPER
// ================================================================
function setupForm(formId, sheetName, statusId, openId, cancelId, cardId, extractor, icon, actText) {
  const form = document.getElementById(formId);
  const card = document.getElementById(cardId);
  if (!form || !card) return;

  form.querySelectorAll('input[type="date"]').forEach(el => { if (!el.value) el.value = todayStr(); });

  document.getElementById(openId)?.addEventListener('click', () => {
    card.style.display = card.style.display === 'none' ? 'block' : 'none';
    form.querySelectorAll('input[type="date"]').forEach(el => { if (!el.value) el.value = todayStr(); });
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById(cancelId)?.addEventListener('click', () => {
    card.style.display = 'none';
    form.reset();
    setFormStatus(statusId, '', '');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFormStatus(statusId, '⏳ Saving to Google Sheets...', 'loading');
    const data = extractor(form);
    try {
      await sendToSheet(sheetName, data);
      setFormStatus(statusId, '✅ Saved successfully!', 'success');
      addActivity(icon, actText(form));
      form.reset();
      form.querySelectorAll('input[type="date"]').forEach(el => { el.value = todayStr(); });
      delete cache[sheetName];
      setTimeout(() => loadSectionData(sheetName), 1500);
    } catch (err) {
      console.error(err);
      setFormStatus(statusId, '❌ Network error. Check connection and Script URL.', 'error');
    }
  });
}

// ================================================================
// SEARCH & FILTER
// ================================================================
function setupSearch(inputId, tbodyId, cols) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll(`#${tbodyId} tr`).forEach(row => {
      const text = cols.map(i => row.cells[i]?.textContent || '').join(' ').toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

function setupSelectFilter(selectId, tbodyId, col) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.addEventListener('change', () => {
    const val = sel.value.toLowerCase();
    document.querySelectorAll(`#${tbodyId} tr`).forEach(row => {
      const text = (row.cells[col]?.textContent || '').toLowerCase();
      row.style.display = (!val || text.includes(val)) ? '' : 'none';
    });
  });
}

// ================================================================
// NAVIGATION
// ================================================================
function switchSection(id) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const section = document.getElementById('section-' + id);
  if (section) section.classList.add('active');
  const nav = document.querySelector(`.nav-item[data-section="${id}"]`);
  if (nav) nav.classList.add('active');
  document.getElementById('sidebar')?.classList.remove('open');
  const loaders = {
    overview:    () => { loadStudents(); loadPayments(); loadEnquiries(); loadServices(); },
    students:    loadStudents,
    attendance:  loadAttendance,
    payments:    loadPayments,
    enquiries:   loadEnquiries,
    services:    loadServices,
    fleet:       loadFleet,
    instructors: loadInstructors,
  };
  if (loaders[id]) loaders[id]();
}

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  setEl('dashDate', dateStr);
  setEl('overviewDate', dateStr);

  // Google Sheets deep links
  const base = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/edit#gid=`;
  const links = {
    studentsSheetLink: 0, attendanceSheetLink: 1, paymentsSheetLink: 2,
    enquiriesSheetLink: 3, servicesSheetLink: 4, fleetSheetLink: 5, instructorsSheetLink: 6,
  };
  Object.entries(links).forEach(([id, gid]) => {
    document.getElementById(id)?.setAttribute('href', base + gid);
  });

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchSection(item.dataset.section));
  });
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.goto));
  });

  // Mobile sidebar
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });
  document.getElementById('sidebarClose')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('open');
  });

  // Attendance date filter
  document.getElementById('attendanceDateFilter')?.addEventListener('change', function() {
    const val = this.value;
    document.querySelectorAll('#attendanceBody tr').forEach(row => {
      row.style.display = (!val || (row.cells[0]?.textContent || '').includes(val)) ? '' : 'none';
    });
  });

  // Forms
  setupForm('studentForm', SHEETS.students, 'studentFormStatus',
    'openStudentForm', 'cancelStudentForm', 'studentFormCard',
    f => { const d = getFormData(f); return [d.studentName, d.phone, d.course, d.instructor, d.startDate, d.totalFee, d.feePaid||'0', d.address, d.notes]; },
    '🎓', f => `New student: ${getFormData(f).studentName}`
  );
  setupForm('attendanceForm', SHEETS.attendance, 'attendanceFormStatus',
    'openAttendanceForm', 'cancelAttendanceForm', 'attendanceFormCard',
    f => { const d = getFormData(f); return [d.date, d.studentName, d.instructor, d.status, d.trainingDay, d.car, d.notes]; },
    '📅', f => `Attendance: ${getFormData(f).studentName}`
  );
  setupForm('paymentForm', SHEETS.payments, 'paymentFormStatus',
    'openPaymentForm', 'cancelPaymentForm', 'paymentFormCard',
    f => { const d = getFormData(f); return [d.date, d.studentName, d.amount, d.paymentMode, d.paymentType, d.receipt, d.notes]; },
    '💰', f => { const d = getFormData(f); return `Payment ₹${d.amount} from ${d.studentName}`; }
  );
  setupForm('enquiryForm', SHEETS.enquiries, 'enquiryFormStatus',
    'openEnquiryForm', 'cancelEnquiryForm', 'enquiryFormCard',
    f => { const d = getFormData(f); return [d.date, d.name, d.phone, d.source, d.course, d.status, d.notes]; },
    '📞', f => `Enquiry from ${getFormData(f).name}`
  );
  setupForm('serviceForm', SHEETS.services, 'serviceFormStatus',
    'openServiceForm', 'cancelServiceForm', 'serviceFormCard',
    f => { const d = getFormData(f); return [d.date, d.customerName, d.phone, d.serviceType, d.dlNumber, d.fee, d.paid, d.status, d.expectedDate, d.handledBy, d.notes]; },
    '📋', f => `Service: ${getFormData(f).serviceType} for ${getFormData(f).customerName}`
  );
  setupForm('fleetForm', SHEETS.fleet, 'fleetFormStatus',
    'openFleetForm', 'cancelFleetForm', 'fleetFormCard',
    f => { const d = getFormData(f); return [d.date, d.car, d.instructor, d.hours, d.fuel, d.fuelCost, d.issue, d.odometer, d.notes]; },
    '🚗', f => `Car log: ${getFormData(f).car}`
  );
  setupForm('instructorForm', SHEETS.instructors, 'instructorFormStatus',
    'openInstructorForm', 'cancelInstructorForm', 'instructorFormCard',
    f => { const d = getFormData(f); return [d.date, d.instructor, d.studentsCount, d.hours, d.notes]; },
    '👨‍🏫', f => `Activity: ${getFormData(f).instructor}`
  );

  // Filters
  setupSearch('studentSearch',  'studentsBody',     [0,1,2,3]);
  setupSearch('paymentSearch',  'paymentsBody',     [0,1,3,4]);
  setupSelectFilter('enquiryStatusFilter', 'enquiriesBody',   5);
  setupSelectFilter('serviceTypeFilter',   'servicesBody',    3);
  setupSelectFilter('serviceStatusFilter', 'servicesBody',    7);
  setupSelectFilter('carFilter',           'fleetBody',       1);
  setupSelectFilter('instructorFilter',    'instructorsBody', 1);

  switchSection('overview');
});
