// Inicializa Firebase-Admin con tu key.json
const admin = require('firebase-admin');
const serviceAccount = require('../../key.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
module.exports = admin;
