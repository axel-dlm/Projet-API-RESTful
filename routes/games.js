const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

router.post('/', gamesController.createGame);
router.get('/', gamesController.getGames);
router.get('/:id', gamesController.getGameById);
router.patch('/:id', gamesController.updateGame);
router.delete('/:id', gamesController.deleteGame);

module.exports = router;
