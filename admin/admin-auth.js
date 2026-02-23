/* ============================================================
   SADGURU SAINATH DRIVING SCHOOL — ADMIN AUTH
   admin/admin-auth.js
   ============================================================ */

// ⚠️  Change these before going live
const ADMIN_CREDENTIALS = {
  username: 'sainathadmin',
  password: 'sainath@2026'
};

const SESSION_KEY      = 'sainath_admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

/* ── Session helpers ── */
function isLoggedIn() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    return Date.now() < (s.expiry || 0);
  } catch { return false; }
}

function createSession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ expiry: Date.now() + SESSION_DURATION }));
}

function destroySession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ============================================================
   LOGIN PAGE LOGIC
   (runs when admin/index.html loads)
   ============================================================ */
const loginForm = document.getElementById('loginForm');
if (loginForm) {

  // Already logged in? Go straight to dashboard
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
  }

  // Toggle password visibility
  document.getElementById('togglePass')?.addEventListener('click', () => {
    const p = document.getElementById('password');
    p.type = p.type === 'password' ? 'text' : 'password';
  });

  // Handle login submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u   = document.getElementById('username').value.trim();
    const p   = document.getElementById('password').value;
    const err = document.getElementById('loginError');

    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      createSession();
      window.location.href = 'dashboard.html';
    } else {
      err.textContent   = '❌ Incorrect username or password. Please try again.';
      err.style.display = 'block';
      setTimeout(() => { err.style.display = 'none'; }, 4000);
    }
  });
}

/* ============================================================
   DASHBOARD GUARD
   (runs when admin/dashboard.html loads)
   ============================================================ */
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  // Not logged in? Send back to login
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }

  // Logout button
  logoutBtn.addEventListener('click', () => {
    destroySession();
    window.location.href = 'index.html';
  });
}