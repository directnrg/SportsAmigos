import express from 'express';
import { getGuesses, getGuessById, createGuess, updateGuess, deleteGuess } from '../controllers/guessController.js'

const guessRouter = express().router()

// Create a new guess
guessRouter.post('/guess', createGuess);
// Get all guesses
guessRouter.get('/guesses', getGuesses);

// Get a single guess by id
guessRouter.get('/guess/:guessId', getGuessById);

// Update a single guess by id
guessRouter.patch('/guess/:guessId', updateGuess);

// Delete a single guess by id
guessRouter.delete('/guess/:guessId', deleteGuess);

export default guessRouter;