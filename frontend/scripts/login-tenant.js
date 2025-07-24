// FRONT: login multitenant
const API_BASE = 'http://localhost:8080';

document.getElementById('loginBtn').addEventListener('click', async () => {
  const tenantId = document.getElementById('tenantId').value;
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  // Ocultar mensajes previos
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';

  // Validación básica
  if (!tenantId || !email || !password) {
    errorMessage.textContent = 'Por favor complete todos los campos';
    errorMessage.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/login/tenant/${tenantId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      errorMessage.textContent = errorData.error || 'Error en la autenticación';
      errorMessage.style.display = 'block';
      return;
    }

    const {
      idToken,
      tenantId: responseTenantId,
      refreshToken,
      expiresIn,
    } = await res.json();

    // Guardar tokens en localStorage
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('tenantId', responseTenantId);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    if (expiresIn) {
      localStorage.setItem('tokenExpiresIn', expiresIn);
    }

    successMessage.textContent = `Login exitoso para tenant: ${responseTenantId}`;
    successMessage.style.display = 'block';

    // Redirigir después de un breve delay
    setTimeout(() => {
      window.location.href = 'success.html';
    }, 1500);
  } catch (error) {
    console.error('Error en login:', error);
    errorMessage.textContent = 'Error de conexión. Intente nuevamente.';
    errorMessage.style.display = 'block';
  }
});

// Permitir login con Enter
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('loginBtn').click();
  }
});
