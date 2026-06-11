import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://gudswujwxrrutlulzyzv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hjxG_ZdR9bbgcyi83vl3vQ_lk-w9GDn';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Redirect if already logged in ───────────────────────────
supabase.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = 'html/home.html';
});

// ── Helpers ──────────────────────────────────────────────────
function el(id) { return document.getElementById(id); }

function setAlert(id, msg, isSuccess = false) {
  const e = el(id);
  if (!e) return;
  e.textContent = msg;
  e.className = 'alert' + (isSuccess ? ' success' : '');
  e.style.display = msg ? 'block' : 'none';
}

function hideErr(id) { const e = el(id); if (e) e.style.display = 'none'; }
function showErr(id)  { const e = el(id); if (e) e.style.display = 'block'; }

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

function isValidPassword(password) {
  return (
    /.{6,}/.test(password) &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%?&*(),.?":{}|<>]/.test(password)
  );
}

// ── Toggle views ─────────────────────────────────────────────
window.showLogin = function () {
  el('loginView').style.display = '';
  el('registerView').style.display = 'none';
  setAlert('loginAlert', '');
};

window.showRegister = function () {
  el('loginView').style.display = 'none';
  el('registerView').style.display = '';
  setAlert('registerAlert', '');
};

// ── Login ─────────────────────────────────────────────────────
window.handleLogin = async function () {
  const email    = el('loginEmail').value.trim();
  const password = el('loginPassword').value;

  setAlert('loginAlert', '');
  hideErr('loginEmailErr');
  hideErr('loginPasswordErr');

  if (!email || !isValidEmail(email)) { showErr('loginEmailErr'); return; }
  if (!password)                       { showErr('loginPasswordErr'); return; }

  const btn = el('loginBtn');
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  btn.disabled = false;
  btn.textContent = 'Sign In';

  if (error) { setAlert('loginAlert', error.message); return; }

  window.location.href = 'html/home.html';
};

// ── Register ──────────────────────────────────────────────────
window.handleRegister = async function () {
  const email    = el('regEmail').value.trim();
  const password = el('regPassword').value;
  const confirm  = el('regConfirm').value;
  const prenom   = el('regPrenom').value.trim();
  const nom      = el('regNom').value.trim();

  setAlert('registerAlert', '');
  hideErr('regEmailErr');
  hideErr('regPasswordErr');
  hideErr('regConfirmErr');

  if (!email || !isValidEmail(email)) { showErr('regEmailErr');    return; }
  if (!isValidPassword(password))     { showErr('regPasswordErr'); return; }
  if (password !== confirm)           { showErr('regConfirmErr');  return; }

  const btn = el('registerBtn');
  btn.disabled = true;
  btn.textContent = 'Creating account…';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { prenom, nom } }
  });

  btn.disabled = false;
  btn.textContent = 'Create Account';

  if (error) { setAlert('registerAlert', error.message); return; }

  setAlert('registerAlert', 'Account created! Check your email to confirm, then sign in.', true);
};

