// Genera una contraseña temporal sencilla
exports.generateTempPassword = () =>
  Math.random().toString(36).slice(-8) + Date.now();
