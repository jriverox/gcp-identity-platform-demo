// FRONT: login
const API_BASE = 'http://localhost:8080';
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return (window.location.href = 'denied.html');
  const { idToken } = await res.json();
  localStorage.setItem('idToken', idToken);
  window.location.href = 'success.html';
});
