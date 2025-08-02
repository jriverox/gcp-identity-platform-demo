// FRONT: preregistro
const API_BASE = 'http://localhost:8080';
document.getElementById('registerBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const providerId = document.getElementById('provider').value;
  const tenantId = document.getElementById('tenantId').value;
  const res = await fetch(`${API_BASE}/api/preregister/tenant/${tenantId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, providerId }),
  });
  const { ok, error } = await res.json();
  alert(ok ? 'Revisa tu email para activar la cuenta' : `Error: ${error}`);
});
