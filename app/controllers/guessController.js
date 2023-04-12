import Guess from '../models/guess.js';
import Game from '../models/game.js';
import Standing from '../models/standing.js';
import League from '../models/league.js';
import mongoose from 'mongoose';


/**
 * Creates a new guess object and saves it to the database.
 *
 * @async
 * @function createGuess
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} 400 error if there is an error creating the guess
 * @returns {Object} JSON object with success message and the populated `Guess` object
 */
export const createGuess = async (req, res) => {
  try {
    const { league, user, guesses } = req.body;
    const createdGuesses = [];

    for (const guessData of guesses) {
      // Check if the user has already guessed for the game in the league
      const existingGuess = await Guess.findOne({
        user: user,
        game: guessData.game,
        league: league,
      });

      if (existingGuess) {
        return res.status(400).json({
          message: `User has already made a guess for game ${guessData.game} in league ${league}`,
        });
      }

      const newGuess = new Guess({
        user: user,
        game: guessData.game,
        guess: guessData.guess,
        league: league,
        createdAt: new Date(),
      });

      await newGuess.save();
      createdGuesses.push(newGuess);

      // Add guess to the league an establish one to many relationship between League an Game
      const leagueToUpdate = await League.findById(league);
      leagueToUpdate.guesses.push(newGuess._id);

      // Check if the game is already in the league's games array before adding it
      if (!leagueToUpdate.games.includes(guessData.game)) {
        leagueToUpdate.games.push(guessData.game); // Add the game id to League games array
      }
      
      await leagueToUpdate.save();
    }
    res.status(201).json(createdGuesses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};





/**
 * Retrieve all guesses, populated with user and game data.
 *
 * @async
 * @function getAllGuesses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON object representing all guesses
 * @throws {Error} 400 error if there was an error fetching the guesses
 */
export const getAllGuesses = async (req, res) => {
  try {
    const guesses = await Guess.find().populate({
      path: 'user',
      model: 'User',
      select: 'fullName email'
    }).populate('game');
    res.status(200).json(guesses);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching guesses', error });
  }
};

/**
 * Retrieves a guess by ID.
 *
 * @async
 * @function getGuessById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} 400 error if guess is not found
 * @returns {Object} JSON object representing the retrieved guess
 */
export const getGuessById = async (req, res) => {
  try {
    const guess = req.guess
    res.status(200).json(guess);
  } catch (error) {
    res.status(400).json({ message: 'Guess not found', error: error });
  }
}

/**
 * Update a guess by ID.
 *
 * @async
 * @function updateGuess
 * @param {Object} req - Express request object
 * @param {Object} req.guess - Guess object to be updated, obtained from middleware
 * @param {Object} req.body - Request body containing fields to update
 * @param {Object} res - Express response object
 * @throws {Error} 404 error if guess is not found
 * @throws {Error} 400 error if there's an error updating the guess
 * @returns {Object} JSON object representing the updated guess
 */
export const updateGuess = async (req, res) => {
  try {
    const { id } = req.guess;
    const { user, game, guess, guessPoints } = req.body;
    const updatedGuess = await Guess.findOneAndUpdate({ _id: id },
      { user, game, guess, guessPoints },
      { new: true, runValidators: true }
    );
    if (!updatedGuess) {
      return res.status(404).json({ message: 'Guess not found' });
    }
    res.status(200).json(updatedGuess);
  } catch (error) {
    res.status(400).json({ message: 'Error updating guess', error });
  }
}

/**
 * Delete a guess by ID.
 *
 * @async
 * @function deleteGuess
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} 404 error if guess is not found
 * @returns {Object} JSON object indicating successful deletion of guess
 */
export const deleteGuess = async (req, res) => {
  try {
    const { id } = req.guess;
    const deletedGuess = await Guess.findOneAndDelete({ _id: id });
    if (!deletedGuess) {
      return res.status(404).json({ message: 'Guess not found' });
    }
    res.status(200).json({ message: 'Guess deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting guess', error });
  }
};


//function to calculate the guesses done last week // possibly an admin method
export const calculateGuessPointsOfAllUsers = async () => {
  try {
    // Find all guesses made in the current week
    const guesses = await Guess.find({})
      .populate({
        path: 'user',
        model: 'User',
        select: 'fullName'
      })
      .populate('game');


    for (const guess of guesses) {
      console.log(`Processing guess: ${guess._id}, user: ${guess.user.fullName}, game: ${guess.game._id}`);
      if (guess.guess === guess.game.result) {
        console.log(`Correct guess: ${guess.guess}, result: ${guess.game.result}`);
        // Increment the user's points by 1
        guess.guessPoints += 1;
        await guess.save();
      } else {
        console.log(`Incorrect guess: ${guess.guess}, result: ${guess.game.result}`);
      }
    }
  } catch (error) {
    console.error('Error updating guess points of last week:', error);
  }
};


//function to calculate the guesses done in a week
export const calculateGuessPointsOfUserByUserId = async (req, res) => {
  console.log('calculateGuessPointsOfUserByUserId called');

  const { userId } = req.params;
  try {
    // Find all guesses made in the current week
    const guesses = await Guess.find({
      user: userId
    })
      .populate({ path: 'user', select: 'fullName' })
      .populate({ path: 'game', select: 'result' })

    const updatedGuesses = []
    for (const guess of guesses) {
      console.log(`Processing guess: ${guess._id}, user: ${guess.user.fullName}, game: ${guess.game._id}`);
      if (guess.guess === guess.game.result) {
        console.log(`Correct guess: ${guess.guess}, result: ${guess.game.result}`);
        // Increment the user's points by 1
        guess.guessPoints += 1;
        await guess.save();
        updatedGuesses.push(guess);
      } else {
        console.log(`Incorrect guess: ${guess.guess}, result: ${guess.game.result}`);
      }
    }
    res.status(200).json({ updatedGuesses: updatedGuesses })
  } catch (error) {
    console.error('Error updating guess points:', error);
    res.status(400).json({ message: `Error updating User guess points of User with ID: ${userId}`, error: error.message });
  }
};
