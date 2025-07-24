const {
  createUser,
  createUserForTenant,
  setCustomUserClaims,
  setCustomUserClaimsForTenant,
  generatePasswordResetLink,
  generatePasswordResetLinkForTenant,
} = require('../utils/firebaseAdmin');
const { generateTempPassword } = require('../utils/generateTempPassword');

exports.preregisterController = async (req, res) => {
  const { email, providerId } = req.body;
  console.log(email, providerId);
  if (!email || !providerId)
    return res.status(400).json({ error: 'Faltan datos' });

  try {
    const tempPwd = generateTempPassword();
    const userRecord = await createUser(email, tempPwd, false);

    await setCustomUserClaims(userRecord.uid, { providerId });
    const link = await generatePasswordResetLink(email);
    console.log(`Reset link: ${link}`); // Por PoC, lo mostramos en consola
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.preregisterForTenantController = async (req, res) => {
  const { email, providerId } = req.body;
  const tenantId = req.params.tenantId;

  console.log(email, providerId, tenantId);

  if (!email || !providerId || !tenantId)
    return res.status(400).json({ error: 'Faltan datos' });

  try {
    const tempPwd = generateTempPassword();
    const userRecord = await createUserForTenant(
      tenantId,
      email,
      tempPwd,
      false
    );

    await setCustomUserClaimsForTenant(tenantId, userRecord.uid, {
      providerId,
    });
    const link = await generatePasswordResetLinkForTenant(tenantId, email);
    console.log(`Reset link: ${link}`); // Por PoC, lo mostramos en consola
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
