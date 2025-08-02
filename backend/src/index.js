require('dotenv').config();
const express = require('express');
const cors = require('cors');
const preregisterRoutes = require('./routes/preregister');
const authRoutes = require('./routes/auth');
const admin = require('./utils/firebaseAdmin');

const app = express();
const PORT = process.env.PORT || 8080;
const ALLOWED = ['http://localhost:8000'];

app.use(cors({ origin: ALLOWED }));
app.use(express.json());

app.use('/api/preregister', preregisterRoutes);
app.use('/api/login', authRoutes);

app.get('/api/protected', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  // authHeader === 'Bearer eyJhbGciOiJ...'
  const idToken = authHeader.startsWith('Bearer ')
    ? authHeader.split('Bearer ')[1]
    : null;

  if (!idToken) {
    return res.status(401).json({ error: 'No se proporcionó token' });
  }

  try {
    // Aquí es donde usas verifyIdToken
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // decodedToken contiene los claims, p. ej. decodedToken.uid, decodedToken.providerId...
    res.json({ data: 'Acceso concedido', claims: decodedToken });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
