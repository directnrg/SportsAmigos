import { Router } from 'express';
import { getAllGuesses, getGuessById, createGuess, updateGuess, deleteGuess } from '../controllers/guessController.js'

const guessRouter = Router()

// Create a new guess
guessRouter.post('/guess', createGuess);
// Get all guesses
guessRouter.get('/guesses', getAllGuesses);

// Get a single guess by id
guessRouter.get('/guess/:guessId', getGuessById);

// Update a single guess by id
guessRouter.patch('/guess/:guessId', updateGuess);

// Delete a single guess by id
guessRouter.delete('/guess/:guessId', deleteGuess);

export default guessRouter;