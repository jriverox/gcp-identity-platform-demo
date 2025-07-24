# Funcionalidad Multitenant - Google Identity Platform

Esta implementación extiende el sistema de autenticación existente para soportar múltiples tenants (inquilinos) usando Google Identity Platform.

## Características Implementadas

### 1. Login Multitenant

- **Endpoint**: `POST /api/login/tenant/:tenantId`
- **Descripción**: Permite a los usuarios autenticarse en un tenant específico
- **Validación**: Verifica que el usuario pertenece al tenant especificado

### 2. Verificación de Token Multitenant

- **Endpoint**: `GET /api/login/verify/tenant/:tenantId`
- **Descripción**: Verifica que un token pertenece a un tenant específico
- **Uso**: Para proteger recursos específicos de cada tenant

## Archivos Modificados/Creados

### Backend

- `backend/src/controllers/authController.js` - Nuevas funciones multitenant
- `backend/src/routes/auth.js` - Nuevas rutas multitenant

### Frontend

- `frontend/login-tenant.html` - Página de login multitenant
- `frontend/scripts/login-tenant.js` - Script para login multitenant
- `frontend/protected-tenant.html` - Página protegida multitenant
- `frontend/scripts/protected-tenant.js` - Script para verificación multitenant

## Uso

### 1. Login Multitenant

```javascript
// Ejemplo de uso del endpoint de login multitenant
const response = await fetch('/api/login/tenant/tenant123', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'contraseña123',
  }),
});

const { idToken, tenantId, refreshToken } = await response.json();
```

### 2. Verificación de Token Multitenant

```javascript
// Ejemplo de verificación de token multitenant
const response = await fetch('/api/login/verify/tenant/tenant123', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${idToken}`,
    'Content-Type': 'application/json',
  },
});

const { valid, tenantId, uid, email, claims } = await response.json();
```

## Flujo de Autenticación Multitenant

1. **Login**: El usuario proporciona email, password y tenantId
2. **Autenticación**: Se autentica con Firebase Identity Toolkit
3. **Verificación de Tenant**: Se verifica que el usuario pertenece al tenant especificado
4. **Respuesta**: Se devuelve el token con información del tenant

## Seguridad

- **Validación de Tenant**: Cada token se verifica para asegurar que pertenece al tenant correcto
- **Aislamiento**: Los usuarios solo pueden acceder a recursos de su tenant
- **Manejo de Errores**: Errores específicos para diferentes tipos de fallos de autenticación

## Páginas de Demostración

1. **login-tenant.html**: Página de login multitenant
2. **protected-tenant.html**: Página protegida que demuestra la verificación de tokens

## Configuración Requerida

Asegúrate de tener configuradas las siguientes variables de entorno:

- `API_KEY`: Clave de API de Firebase
- `PROJECT_ID`: ID del proyecto de Firebase
- `SA_CLIENT_EMAIL`: Email del service account
- `SA_PRIVATE_KEY`: Clave privada del service account

## Notas Importantes

- Los tenants deben estar previamente configurados en Google Identity Platform
- Los usuarios deben ser creados dentro del tenant correspondiente
- La verificación de tenant se realiza usando Firebase Admin SDK
- Los tokens incluyen información del tenant para validación posterior
