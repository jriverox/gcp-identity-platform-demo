const axios = require('axios');
const API_KEY = process.env.API_KEY;

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
