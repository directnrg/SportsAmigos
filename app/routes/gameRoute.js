import express from 'express';
import {
  getGames,
  getGameById,
  updateGameResultManually,
  deleteGame,
  populateGames,
} from '../controllers/gameController.js';
import {findGameById} from '../middleware/gameMiddleWare.js';

const gameRouter = express.Router();
// Get all games
gameRouter.get('/games', getGames);

//populate games of the current week making a call to api sports
gameRouter.get('/games-of-the-week', populateGames)

// Get a single game by id
gameRouter.get('/game/:gameId', findGameById, getGameById);

// Update a game
gameRouter.patch('/game/:gameId', findGameById, updateGameResultManually);

// Delete a game
gameRouter.delete('/game/:gameId', findGameById, deleteGame);

// Add a catch-all route to return a 404 error for /api/game without an ID
gameRouter.all('/game', (req, res) => {
    res.status(404).json({ error: 'Game not Found' });
  });

export default gameRouter;
