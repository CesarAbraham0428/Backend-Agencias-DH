//services\tokenStore.js
const tokens = new Map();

exports.saveSuperToken = (email, token) => {
  const expiresAt = Date.now() + 900000; // 15 minutos
  tokens.set(email, { token, expiresAt });
};

exports.validateSuperToken = (email, token) => {
  const storedToken = tokens.get(email);
  if (!storedToken || storedToken.token !== token || Date.now() > storedToken.expiresAt) {
    return false;
  }
  tokens.delete(email); // Eliminar token usado
  return true;
};