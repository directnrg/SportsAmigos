import Guess from '../models/guess.js';
import Game from '../models/game.js';
import Standing from '../models/standing.js';
import League from '../models/league.js';


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
      const newGuess = new Guess({
        user: user,
        game: guessData.game,
        guess: guessData.guess,
        league: league,
        date: new Date(),
      });

      await newGuess.save();
      createdGuesses.push(newGuess);

      // Add guess to the league
      const leagueToUpdate = await League.findById(league);
      leagueToUpdate.guesses.push(newGuess._id);
      //leagueToUpdate.games.push(guessData.game); // Add the game id to League games array
      await leagueToUpdate.save();
    }

/**
 * to add multiple user guesses from frontend that assumes that all
 * guesses sent in the request are going to have the same ID of user.
 * this method will serve the purpose of handling a single request for adding multiple
 * user guesses.
 */
// export const addAllUserGuesses = async (req, res) => {
//   try {
//     //array of guesses
//     const userGuesses = req.body;

//     // Get the user ID from the request body (assuming all guesses have the same user ID)
//     const userId = userGuesses[0].userId;

//     // Validate that all user IDs are the same
//     const allUserIdsSame = userGuesses.every(
//       (guess) => guess.userId === userId
//     );

//     if (!allUserIdsSame) {
//       return res
//         .status(400)
//         .json({ message: 'All user IDs in the array must be the same' });
//     }

//     // Save all the guesses in parallel
//     await Promise.all(userGuesses.map((guess) => new Guess(guess).save()));

//     // Return the stored guesses filtered by the user's ID
//     const storedGuesses = await Guess.find({ userId });
//     res.status(201).json({
//       message: 'Successfully added all guesses of user',
//       guesses: storedGuesses,
//     });
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating guess', error });
//   }
// };

/**
 * Add multiple guesses for a single user in a single request.
 * assumes that all guesses sent in the request are going to have the same ID of user.
 * 
 * @async
 * @function addAllUserGuesses
 * @param {Object} req - Express request object
 * @param {Object} req.body - Array of guess objects with a common user ID
 * @param {string} req.body[].userId - User ID for all the guesses in the array
 * @throws 400 error if user IDs in the array are not the same
 * @returns {Object} JSON object representing the stored guesses
 * @returns {string} Object.message - success message
 * @returns {Object[]} Object.guesses - Array of stored guess objects
 */
// export const addAllUserGuesses = async (req, res) => {
//   try {
//     //array of guesses
//     const userGuesses = req.body;

//     // Get the user ID from the request body (assuming all guesses have the same user ID)
//     const userId = userGuesses[0].userId;

//     // Validate that all user IDs are the same
//     const allUserIdsSame = userGuesses.every(
//       (guess) => guess.userId === userId
//     );

//     if (!allUserIdsSame) {
//       return res
//         .status(400)
//         .json({ message: 'All user IDs in the array must be the same' });
//     }

//     // Save all the guesses in parallel
//     await Promise.all(userGuesses.map((guess) => new Guess(guess).save()));

//     // Return the stored guesses filtered by the user's ID
//     const storedGuesses = await Guess.find({ userId });
//     res.status(201).json({
//       message: 'Successfully added all guesses of user',
//       guesses: storedGuesses,
//     });
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating guess', error });
//   }
// };

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
    const guesses = await Guess.find().populate('user').populate('game');
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
        const { user, game, guess, userPoints } = req.body;
        const updatedGuess = await Guess.findOneAndUpdate({ _id: id },
            { user, game, guess, userPoints },
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

//function to calculate the guesses done in a week
export const updateGuessPoints = async () => {
  try {
    // Get the start and end dates for the current week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Find all guesses made in the current week
    const guesses = await Guess.find({
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    })
      .populate('user')
      .populate('game');

    for (const guess of guesses) {
      if (guess.guess === guess.game.result) {
        // Find the Standing record for the user in the league
        let standing = await Standing.findOne({
          user: guess.user._id,
          league: guess.game.league,
        });
        if (!standing) {
          standing = new Standing({
            user: guess.user._id,
            league: guess.game.league,
            points: 0,
          });
        }

        // Increment the user's points by 1
        standing.points += 1;
        await standing.save();
      }
    }
  } catch (error) {
    console.error('Error updating guess points:', error);
  }
};
