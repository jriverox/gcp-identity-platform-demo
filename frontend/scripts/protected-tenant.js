// FRONT: página protegida multitenant
const API_BASE = 'http://localhost:8080';

// Verificar si hay un token al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const idToken = localStorage.getItem('idToken');
  const storedTenantId = localStorage.getItem('tenantId');

  if (!idToken) {
    window.location.href = 'login-tenant.html';
    return;
  }

  // Si hay un tenantId guardado, mostrarlo en el campo
  if (storedTenantId) {
    document.getElementById('tenantId').value = storedTenantId;
  }
});

document.getElementById('verifyBtn').addEventListener('click', async () => {
  const tenantId = document.getElementById('tenantId').value;
  const idToken = localStorage.getItem('idToken');

  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const userInfo = document.getElementById('userInfo');
  const userData = document.getElementById('userData');

  // Ocultar mensajes previos
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
  userInfo.style.display = 'none';

  if (!tenantId) {
    errorMessage.textContent = 'Por favor ingrese un Tenant ID';
    errorMessage.style.display = 'block';
    return;
  }

  if (!idToken) {
    errorMessage.textContent = 'No hay token de autenticación';
    errorMessage.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/login/verify/tenant/${tenantId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      errorMessage.textContent = errorData.error || 'Error en la verificación';
      errorMessage.style.display = 'block';
      return;
    }

    const userInfoData = await res.json();

    successMessage.textContent = 'Token verificado correctamente';
    successMessage.style.display = 'block';

    // Mostrar información del usuario
    userData.textContent = JSON.stringify(userInfoData, null, 2);
    userInfo.style.display = 'block';
  } catch (error) {
    console.error('Error verificando token:', error);
    errorMessage.textContent = 'Error de conexión. Intente nuevamente.';
    errorMessage.style.display = 'block';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  // Limpiar localStorage
  localStorage.removeItem('idToken');
  localStorage.removeItem('tenantId');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresIn');

  // Redirigir al login
  window.location.href = 'login-tenant.html';
});
