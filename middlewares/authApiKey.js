const { API_KEY } = require('../config');

module.exports = (req, res, next) => {
  if (req.method === 'GET') return next();

  const key = req.header('x-api-key') || req.query.api_key;
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: 'Non autorisé : clé API invalide ou manquante' });
  }
  next();
};
