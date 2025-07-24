// Inicializa Firebase-Admin con tu key.json
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.SA_CLIENT_EMAIL,
    privateKey: process.env.SA_PRIVATE_KEY,
  }),
});

const createUser = async (email, password, emailVerified = false) => {
  console.log(email, password, emailVerified);
  const userRecord = await admin
    .auth()
    .createUser({ email, password, emailVerified });
  return userRecord;
};

const createUserForTenant = async (
  tenantId,
  email,
  password,
  emailVerified = false
) => {
  console.log(tenantId, email, password, emailVerified);
  const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
  const userRecord = await tenantAuth.createUser({
    email,
    password,
    emailVerified,
  });
  return userRecord;
};

const setCustomUserClaims = async (uid, claims) => {
  await admin.auth().setCustomUserClaims(uid, claims);
};

const setCustomUserClaimsForTenant = async (tenantId, uid, claims) => {
  const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
  await tenantAuth.setCustomUserClaims(uid, claims);
};

const generatePasswordResetLink = async (email) => {
  const link = await admin.auth().generatePasswordResetLink(email);
  return link;
};

const generatePasswordResetLinkForTenant = async (tenantId, email) => {
  const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
  const link = await tenantAuth.generatePasswordResetLink(email);
  return link;
};

module.exports = {
  createUser,
  createUserForTenant,
  setCustomUserClaims,
  setCustomUserClaimsForTenant,
  generatePasswordResetLink,
  generatePasswordResetLinkForTenant,
};
