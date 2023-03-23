import express from 'express';
import {
  createGame,
  getGames,
  updateGame,
  deleteGame,
} from '../controllers/gameController.js';
import { getGameById } from '../middleware/gameMiddleWare.js';

const gameRouter = express.Router();

// Create a new game
gameRouter.post('/game', createGame);

// Get all games
gameRouter.get('/games', getGames);

// Get a single game by id
gameRouter.get('/game/:gameId', getGameById);

// Update a game
gameRouter.put('/game/:gameId', getGameById, updateGame);

// Delete a game
gameRouter.delete('/game/:gameId', getGameById, deleteGame);

// Add a catch-all route to return a 404 error for /api/game without an ID
gameRouter.all('/game', (req, res) => {
    res.status(404).json({ error: 'Game not Found' });
  });

export default gameRouter;
