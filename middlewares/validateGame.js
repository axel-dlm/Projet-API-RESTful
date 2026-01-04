const { isDate } = require('validator');

module.exports = (req, res, next) => {
  const { title, rating, releaseDate } = req.body;

  // For PATCH (partial updates) we allow missing fields; when fields are present they must be valid.
  const isPatch = req.method === 'PATCH';

  if (!isPatch) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Le champ "title" est requis et doit être une chaîne non vide' });
    }
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Le champ "title" doit être une chaîne non vide lorsqu\'il est fourni' });
    }
    if (title.length > 200) {
      return res.status(400).json({ error: 'Le champ "title" doit contenir au plus 200 caractères' });
    }
  }

  if (rating !== undefined) {
    if (typeof rating !== 'number') return res.status(400).json({ error: 'Le champ "rating" doit être un nombre lorsqu\'il est fourni' });
    if (rating < 0 || rating > 10) return res.status(400).json({ error: 'Le champ "rating" doit être compris entre 0 et 10' });
  }
  if (releaseDate !== undefined && releaseDate !== null && releaseDate !== '') {
    if (!isDate(String(releaseDate))) return res.status(400).json({ error: 'Le champ "releaseDate" doit être une date valide (AAAA-MM-JJ)' });
  }

  next();
};
