import { Router } from 'express';
import {
  getAllGuesses,
  createGuess,
  getGuessById,
  updateGuess,
  deleteGuess,
  calculateGuessPointsOfAllUsers,
  calculateGuessPointsOfUserByUserId
//   addAllUserGuesses,
} from '../controllers/guessController.js';
import {
  findGuessById,
  checkGuessUsage,
} from '../middleware/guessMiddleware.js';

const guessRouter = Router();

// Create a new guess
guessRouter.post('/guess', createGuess);

// add all guesses from a user
// guessRouter.post('/user-guesses', addAllUserGuesses);

// Get all guesses
guessRouter.get('/guesses', getAllGuesses);

//Calcullate guess points of all users - possibly an admin route to update all user guesses at the same time.
guessRouter.get('/guesses/calc-all-user-guess-points', calculateGuessPointsOfAllUsers)

//Calculate guess points of user by user Id
guessRouter.get('/guesses/calc-guesses-points-user/:userId', calculateGuessPointsOfUserByUserId)

// Get a single guess by id
guessRouter.get('/guess/:guessId', findGuessById, getGuessById);

// Update a single guess by id
guessRouter.patch('/guess/:guessId', findGuessById, updateGuess);

// Delete a single guess by id
guessRouter.delete(
  '/guess/:guessId',
  findGuessById,
  checkGuessUsage,
  deleteGuess
);

export default guessRouter;
