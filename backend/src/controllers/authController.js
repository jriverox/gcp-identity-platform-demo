const axios = require('axios');
const admin = require('firebase-admin');
const API_KEY = process.env.API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;

exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Faltan credenciales');
    console.log(email, password);
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    const { data } = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });
    console.log(data.idToken);
    return res.json({ idToken: data.idToken });
  } catch (error) {
    console.error('Autenticación fallida', error);
    return res.status(401).json({ error: 'Autenticación fallida' });
  }
};

exports.loginForTenantController = async (req, res) => {
  const { email, password } = req.body;
  const tenantId = req.params.tenantId;

  if (!email || !password || !tenantId) {
    console.log('Faltan credenciales o tenantId');
    console.log(email, password, tenantId);
    return res.status(400).json({ error: 'Faltan credenciales o tenantId' });
  }

  try {
    // Primero intentamos autenticar con la API de Firebase Identity Toolkit
    const url = `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/tenants/${tenantId}:signInWithPassword?key=${API_KEY}`;
    console.log(url);
    const { data } = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    // Verificamos que el token pertenece al tenant correcto
    try {
      const decodedToken = await admin.auth().verifyIdToken(data.idToken);

      // Verificamos que el usuario pertenece al tenant especificado
      if (decodedToken.tenant !== tenantId) {
        console.error(`Usuario no pertenece al tenant ${tenantId}`);
        return res.status(403).json({
          error: 'Acceso denegado: usuario no pertenece al tenant especificado',
        });
      }

      console.log(`Login exitoso para tenant ${tenantId}:`, data.idToken);
      return res.json({
        idToken: data.idToken,
        tenantId: tenantId,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        localId: data.localId,
      });
    } catch (verifyError) {
      console.error('Error verificando token:', verifyError);
      return res.status(401).json({ error: 'Token inválido' });
    }
  } catch (error) {
    console.error(
      `Autenticación fallida para tenant ${tenantId}:`,
      error.response?.data || error.message
    );

    // Manejo específico de errores de Firebase
    if (error.response?.data?.error?.message) {
      const firebaseError = error.response.data.error.message;
      if (
        firebaseError.includes('INVALID_PASSWORD') ||
        firebaseError.includes('EMAIL_NOT_FOUND')
      ) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      } else if (firebaseError.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
        return res
          .status(429)
          .json({ error: 'Demasiados intentos. Intente más tarde' });
      }
    }

    return res.status(401).json({ error: 'Autenticación fallida' });
  }
};

exports.verifyTenantTokenController = async (req, res) => {
  const tenantId = req.params.tenantId;
  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ')
    ? authHeader.split('Bearer ')[1]
    : null;

  if (!idToken) {
    return res.status(401).json({ error: 'No se proporcionó token' });
  }

  if (!tenantId) {
    return res.status(400).json({ error: 'No se proporcionó tenantId' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Verificar que el usuario pertenece al tenant especificado
    if (decodedToken.tenant !== tenantId) {
      return res.status(403).json({
        error: 'Acceso denegado: usuario no pertenece al tenant especificado',
        userTenant: decodedToken.tenant,
        requestedTenant: tenantId,
      });
    }

    return res.json({
      valid: true,
      tenantId: decodedToken.tenant,
      uid: decodedToken.uid,
      email: decodedToken.email,
      claims: decodedToken,
    });
  } catch (error) {
    console.error('Error verificando token multitenant:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
