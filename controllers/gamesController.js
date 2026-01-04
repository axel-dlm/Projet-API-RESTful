const { Game } = require('../models');

const addHATEOASLinks = (game, req) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/api/v1/games`;
  try {
    const gameData = game.toJSON ? game.toJSON() : game;
    return {
      ...gameData,
      _links: {
        self: { href: `${baseUrl}/${gameData.id}` },
        update: { href: `${baseUrl}/${gameData.id}`, method: 'PATCH' },
        delete: { href: `${baseUrl}/${gameData.id}`, method: 'DELETE' }
      }
    };
  } catch (err) {
    console.error('Error in addHATEOASLinks:', err);
    return game;
  }
};

exports.createGame = async (req, res, next) => {
  try {
    const data = req.body;
    const game = await Game.create(data);
    res.status(201).json({
      message: 'Game created',
      data: addHATEOASLinks(game, req)
    });
  } catch (err) {
    next(err);
  }
};

exports.getGames = async (req, res, next) => {
  try {
    const games = await Game.findAll();
    const data = games.map(game => addHATEOASLinks(game, req));
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

exports.getGameById = async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Not found' });
    res.json(addHATEOASLinks(game, req));
  } catch (err) {
    next(err);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Not found' });
    await game.update(req.body);
    res.json({
      message: 'Updated',
      data: addHATEOASLinks(game, req)
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Not found' });
    await game.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
