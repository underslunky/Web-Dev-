import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://gudswujwxrrutlulzyzv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hjxG_ZdR9bbgcyi83vl3vQ_lk-w9GDn';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function requireAuth(loginPath = '/index.html') {
  const session = await getSession();
  if (!session) window.location.href = loginPath;
  return session;
}

export async function logout(loginPath = '/index.html') {
  await supabase.auth.signOut();
  window.location.href = loginPath;
}

export function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

export function isValidPassword(password) {
  return (
    /.{6,}/.test(password) &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%?&*(),.?":{}|<>]/.test(password)
  );
}

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

export function initAuthPage(homePath = 'html/home.html') {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) window.location.href = homePath;
  });

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

    window.location.href = homePath;
  };

  window.handleRegister = async function () {
    const email    = el('regEmail').value.trim();
    const password = el('regPassword').value;
    const confirm  = el('regConfirm').value;
    const prenom   = el('regPrenom') ? el('regPrenom').value.trim() : '';
    const nom      = el('regNom')    ? el('regNom').value.trim()    : '';

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
}

export function initSidenav() {
  window.openNav  = () => { document.getElementById('mySidenav').style.width = '250px'; };
  window.closeNav = () => { document.getElementById('mySidenav').style.width = '0'; };
}

