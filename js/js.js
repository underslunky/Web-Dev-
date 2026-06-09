const USERS_KEY = 'app_users';
  const SESSION_KEY = 'app_session';

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  }

  function saveUsers(u) {
    localStorage.setItem(USERS_KEY, JSON.stringify(u));
  }

  function getSession() {
    return localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  }

  function setSession(u, persist) {
    if (persist) {
      localStorage.setItem(SESSION_KEY, u);
    } else {
      sessionStorage.setItem(SESSION_KEY, u);
    }
  }

  function go() {
    window.location.href = 'html/home.html';
  }

  function show(id) { document.getElementById(id).style.display = ''; }
  function hide(id) { document.getElementById(id).style.display = 'none'; }

  function setAlert(id, msg) {
    var e = document.getElementById(id);
    e.textContent = msg;
    e.style.display = msg ? 'block' : 'none';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showLogin() {
    show('loginView');
    hide('registerView');
    setAlert('loginAlert', '');
  }

  function showRegister() {
    hide('loginView');
    show('registerView');
    setAlert('registerAlert', '');
  }

  function handleLogin() {
    var u = document.getElementById('loginUsername').value.trim();
    var e = document.getElementById('loginEmail').value.trim();
    var p = document.getElementById('loginPassword').value.trim();

    setAlert('loginAlert', '');
    document.getElementById('loginUsernameErr').style.display = 'none';
    document.getElementById('loginEmailErr').style.display = 'none';
    document.getElementById('loginPasswordErr').style.display = 'none';

    if (!u) { document.getElementById('loginUsernameErr').style.display = 'block'; return; }
    if (!e || !isValidEmail(e)) { document.getElementById('loginEmailErr').style.display = 'block'; return; }
    if (!p) { document.getElementById('loginPasswordErr').style.display = 'block'; return; }

    var users = getUsers();
    if (!users[u]) { setAlert('loginAlert', 'No account found with that username.'); return; }
    if (users[u].password !== btoa(p)) { setAlert('loginAlert', 'Incorrect password.'); return; }
    if (users[u].email !== e) { setAlert('loginAlert', 'Email does not match this account.'); return; }

    setSession(u, document.getElementById('rememberMe').checked);
    go();
  }

  function handleRegister() {
    var u = document.getElementById('regUsername').value.trim();
    var e = document.getElementById('regEmail').value.trim();
    var p = document.getElementById('regPassword').value.trim();
    var c = document.getElementById('regConfirm').value.trim();

    setAlert('registerAlert', '');
    document.getElementById('regUsernameErr').style.display = 'none';
    document.getElementById('regEmailErr').style.display = 'none';
    document.getElementById('regPasswordErr').style.display = 'none';
    document.getElementById('regConfirmErr').style.display = 'none';

    if (!u) { document.getElementById('regUsernameErr').style.display = 'block'; return; }
    if (!e || !isValidEmail(e)) { document.getElementById('regEmailErr').style.display = 'block'; return; }
    if (p.length < 6) { document.getElementById('regPasswordErr').style.display = 'block'; return; }
    if (p !== c) { document.getElementById('regConfirmErr').style.display = 'block'; return; }

    var users = getUsers();
    if (users[u]) { setAlert('registerAlert', 'That username is already taken.'); return; }

    users[u] = { password: btoa(p), email: e };
    saveUsers(users);
    setSession(u, true);
    go();
  }

  if (getSession()) go();

    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient(https://gudswujwxrrutlulzyzv.supabase.co/rest/v1/, 
sb_publishable_hjxG_ZdR9bbgcyi83vl3vQ_lk-w9GDn);

