// protected.js
const API_BASE = 'http://localhost:8080';
document.getElementById('getData').addEventListener('click', async () => {
  const token = localStorage.getItem('idToken');
  const res = await fetch(`${API_BASE}/api/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  document.getElementById('output').textContent = JSON.stringify(
    await res.json(),
    null,
    2
  );
});
