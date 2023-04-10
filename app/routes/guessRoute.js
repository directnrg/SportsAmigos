import { Router } from 'express';
import { getAllGuesses, createGuess, getGuessById,updateGuess, deleteGuess, addAllUserGuesses } from '../controllers/guessController.js'
import { findGuessById } from '../middleware/guessMiddleware.js';

const guessRouter = Router()

// Create a new guess
guessRouter.post('/guess', createGuess);

// add all guesses from a user
guessRouter.post('/user-guesses', addAllUserGuesses)

// Get all guesses
guessRouter.get('/guesses', getAllGuesses);

// Get a single guess by id
guessRouter.get('/guess/:guessId', findGuessById, getGuessById);

// Update a single guess by id
guessRouter.patch('/guess/:guessId', findGuessById, updateGuess);

// Delete a single guess by id
guessRouter.delete('/guess/:guessId', findGuessById, deleteGuess);

export default guessRouter;