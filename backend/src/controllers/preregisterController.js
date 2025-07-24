const admin = require('../utils/firebaseAdmin');
const { generateTempPassword } = require('../utils/generateTempPassword');

exports.preregisterController = async (req, res) => {
  const { email, providerId } = req.body;
  if (!email || !providerId)
    return res.status(400).json({ error: 'Faltan datos' });

  try {
    const tempPwd = generateTempPassword();
    const userRecord = await admin
      .auth()
      .createUser({ email, password: tempPwd, emailVerified: false });

    await admin.auth().setCustomUserClaims(userRecord.uid, { providerId });
    const link = await admin.auth().generatePasswordResetLink(email);
    console.log(`Reset link: ${link}`); // Por PoC, lo mostramos en consola
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
