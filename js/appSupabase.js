import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://gudswujwxrrutlulzyzv.supabase.co',
  'sb_publishable_hjxG_ZdR9bbgcyi83vl3vQ_lk-w9GDn'
);

// Redirect if already logged in
supabase.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = 'html/home.html';
});

function el(id) { return document.getElementById(id); }

function setAlert(id, msg, isSuccess = false) {
  const e = el(id);
  e.textContent = msg;
  e.className = 'alert' + (isSuccess ? ' success' : '');
  e.style.display = msg ? 'block' : 'none';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(p) {
  return p.length >= 6 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[!@#$%?&*(),.?":{}|<>]/.test(p);
}

window.showLogin = () => {
  el('loginView').style.display = '';
  el('registerView').style.display = 'none';
  setAlert('loginAlert', '');
};

window.showRegister = () => {
  el('loginView').style.display = 'none';
  el('registerView').style.display = '';
  setAlert('registerAlert', '');
};

window.handleLogin = async () => {
  const email = el('loginEmail').value.trim();
  const password = el('loginPassword').value;
  setAlert('loginAlert', '');
  el('loginEmailErr').style.display = 'none';
  el('loginPasswordErr').style.display = 'none';

  if (!isValidEmail(email)) { el('loginEmailErr').style.display = 'block'; return; }
  if (!password) { el('loginPasswordErr').style.display = 'block'; return; }

  const btn = el('loginBtn');
  btn.disabled = true; btn.textContent = 'Signing in…';

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  btn.disabled = false; btn.textContent = 'Sign In';

  if (error) { setAlert('loginAlert', error.message); return; }
  window.location.href = 'html/home.html';
};

window.handleRegister = async () => {
  const username = el('regUsername').value.trim();
  const email    = el('regEmail').value.trim();
  const password = el('regPassword').value;
  const confirm  = el('regConfirm').value;
  const prenom   = el('regPrenom').value.trim();
  const nom      = el('regNom').value.trim();

  setAlert('registerAlert', '');
  el('regUsernameErr').style.display = 'none';
  el('regEmailErr').style.display = 'none';
  el('regPasswordErr').style.display = 'none';
  el('regConfirmErr').style.display = 'none';

  if (!username) { el('regUsernameErr').style.display = 'block'; return; }
  if (!isValidEmail(email)) { el('regEmailErr').style.display = 'block'; return; }
  if (!isValidPassword(password)) { el('regPasswordErr').style.display = 'block'; return; }
  if (password !== confirm) { el('regConfirmErr').style.display = 'block'; return; }

  const btn = el('registerBtn');
  btn.disabled = true; btn.textContent = 'Creating account…';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: username, prenom, nom }
    }
  });

  btn.disabled = false; btn.textContent = 'Create Account';

  if (error) { setAlert('registerAlert', error.message); return; }
  setAlert('registerAlert', 'Account created! You can now sign in.', true);
};

