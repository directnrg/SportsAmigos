import League from '../models/league.js';
import { torontoDateTimeFormat } from '../helpers/TorontoDateFormatter.js';

/**
 * Creates a new league.
 *
 * @async
 * @function createLeague
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {object} req.body - The object containing the league data.
 * @returns {JSON} The newly created league object.
 * @throws {object} The error object with message and error properties.
 */
/**
 * Creates a new league.
 *
 * @async
 * @function createLeague
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {object} req.body - The object containing the league data.
 * @returns {JSON} The newly created league object.
 * @throws {object} The error object with message and error properties.
 */
export const createLeague = async (req, res) => {
  try {
    const league = new League(req.body);
    await league.save();
    res.status(201).json(league);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};


/**
 * Retrieve all the leagues associated with a specific user by their ID.
 * 
 * @async
 * @function getAllLeaguesByUserId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.userId - The ID of the user whose leagues are being retrieved
 * @throws 500 error if there is an internal server error
 * @returns {Object} JSON object representing an array of league objects
 * with games, guesses, and user information populated (user id and fullname)
 */
export const getAllLeaguesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const leagues = await League.find({ users: userId })
      .populate([
        'games',
        {
          path: 'guesses',
          populate: [
            {
              path: 'user',
              model: 'User',
              select: 'fullName',
            },
            {
              path: 'game',
              model: 'Game',
              select: 'homeTeam awayTeam startTime result',
            },
          ],
          select: 'league createdAt',
        },
      ])
      .populate([{
        path: 'users',
        model: 'User',
        select: 'fullName',
      }])
      .exec();

    //Date formatting into Toronto time
    const leaguesWithConvertedDates = leagues.map(league => {
      const newLeague = league.toObject();
      newLeague.games = newLeague.games.map(game => {
        const newGame = { ...game };
        newGame.startTime = torontoDateTimeFormat.format(new Date(game.startTime));
        return newGame;
      });

      //check if guesses exist. If not, ignore
      if (newLeague.guesses) {
        newLeague.guesses = newLeague.guesses.map(guess => {
          const newGuess = { ...guess };
          newGuess.createdAt = torontoDateTimeFormat.format(new Date(guess.createdAt));
          newGuess.game.startTime = torontoDateTimeFormat.format(new Date(guess.game.startTime));
          return newGuess;
        });
      }

      return newLeague;
    });

    res.status(200).json(leaguesWithConvertedDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all leagues and their related data including users, guesses and games.
 *
 * @async
 * @function getLeagues
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 500 error if there is an internal server error
 * @returns {JSON} JSON object representing the leagues and their related data
 */
export const getLeagues = async (req, res) => {
  try {
    const leagues = await League.find()
      .populate([{
        path: 'users',
        model: 'User',
        select: 'fullName',
      }])
      .populate({
        path: 'guesses',
        model: 'Guess',
        populate: [
          {
            path: 'user',
            model: 'User',
            select: 'fullName',
          },
          {
            path: 'game',
            model: 'Game',
            select: 'homeTeam awayTeam startTime result',
          },
        ],
        select: 'league createdAt',
      })
      .populate('games');


    //Date formatting into Toronto time
    const leaguesWithConvertedDates = leagues.map(league => {
      const newLeague = league.toObject();
      newLeague.games = newLeague.games.map(game => {
        const newGame = { ...game };
        newGame.startTime = torontoDateTimeFormat.format(new Date(game.startTime));
        return newGame;
      });

      //check if guesses exist. If not, ignore
      if (newLeague.guesses) {
        newLeague.guesses = newLeague.guesses.map(guess => {
          const newGuess = { ...guess };
          newGuess.createdAt = torontoDateTimeFormat.format(new Date(guess.createdAt));
          newGuess.game.startTime = torontoDateTimeFormat.format(new Date(guess.game.startTime));
          return newGuess;
        });
      }

      return newLeague;
    });

    res.status(200).json(leaguesWithConvertedDates)
  } catch (error) {
    console.error('Error in getLeagues:', error); // Log the error to the console
    res.status(500).json({ message: 'Internal server error', error });
  }
};


/**
 * Retrieves a specific league by ID from the database and populates its related data.
 *
 * @async
 * @function getLeague
 * @param {Object} req - Express request object
 * @param {string} req.params.leagueId - The ID of the league to retrieve
 * @param {Object} res - Express response object
 * @throws 500 error if there is an internal server error
 * @returns {JSON} JSON object representing the requested league, with related data populated
 */
export const getLeagueByLeagueId = async (req, res) => {
  try {
    const league = await League.findById(req.params.leagueId)
      .populate([{
        path: 'users',
        model: 'User',
        select: 'fullName',
      }])
      .populate({
        path: 'guesses',
        populate: [
          {
            path: 'user',
            model: 'User',
            select: 'fullName',
          },
          {
            path: 'game',
            model: 'Game',
            select: 'homeTeam awayTeam startTime result',
          },
        ],
      })
      .populate('games');


    //Date formatting into Toronto time
    if (league) {
      const formattedLeague = league.toObject();
      formattedLeague.games = formattedLeague.games.map(game => {
        const newGame = { ...game };
        newGame.startTime = torontoDateTimeFormat.format(new Date(game.startTime));
        return newGame;
      });

      if (formattedLeague.guesses) {
        formattedLeague.guesses = formattedLeague.guesses.map(guess => {
          const newGuess = { ...guess };
          newGuess.createdAt = torontoDateTimeFormat.format(new Date(guess.createdAt));
          newGuess.game.startTime = torontoDateTimeFormat.format(new Date(guess.game.startTime));
          return newGuess;
        });
      }

      res.status(200).json(formattedLeague);
    } else {
      res.status(404).json({ message: 'League not found' });
    }
  } catch (error) {
    console.error('Error in getLeague:', error); // Log the error to the console
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * Update the name of a league.
 *
 * @async
 * @function updateLeagueName
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing the new league name
 * @param {string} req.body.name - The new name for the league
 * @param {string} req.params.leagueId - ID of the league to update
 * @param {Object} res - Express response object
 * @throws 404 error if the league is not found
 * @throws 400 error if the name field is missing from the request body
 * @throws 500 error if there is an internal server error
 * @returns {JSON} JSON object representing the updated league
 */
export const updateLeagueName = async (req, res) => {
  const { leagueId } = req.params;

  const { name } = req.body;

  try {
    const league = await League.findById(leagueId);

    if (!league) {
      res.status(404).json({ message: 'League not found' });
      return;
    }

    if (name) {
      league.name = name;
      await league.save();
    } else {
      res.status(400).json({ message: 'Missing name field in request body' });
      return;
    }

    res.status(200).json(league);
  } catch (error) {
    console.error('Error in updateLeagueName:', error);
    res.status(500).json({ message: 'Internal server error', error: error });
  }
};


/**
 * Allow a user to join an existing league
 *
 * @param {Object} req - The HTTP request object
 * @param {Object} req.body - The request body containing the leagueId and userId
 * @param {string} req.body.leagueId - The ID of the league the user wants to join
 * @param {string} req.body.userId - The ID of the user who wants to join the league
 * @param {Object} res - The HTTP response object
 * @returns {JSON} - The updated league object after the user has joined the league
 * @throws 500 error if there is an error in the database operation or HTTP request
 */
export const userJoinLeague = async (req, res) => {
  const { leagueId, userId } = req.body;

  try {
    const league = await League.findById(leagueId);

    if (!league) {
      res.status(404).json({ message: 'League not found' });
      return;
    }

    if (league.users.includes(userId)) {
      res.status(400).json({ message: 'User already joined this league' });
      return;
    }

    league.users.push(userId);
    await league.save();

    res.status(200).json(league);
  } catch (error) {
    console.error('Error in userJoinLeague:', error);
    res.status(500).json({ message: 'Internal server error', error: {} });
  }
};


/**
 * Removes a user from a league.
 *
 * @async
 * @function removeUserInLeague
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {string} req.body.leagueId - The ID of the league to remove the user from.
 * @param {string} req.body.userId - The ID of the user to remove from the league.
 * @returns {object} The updated league object.
 * @throws 400 when the User is not part of this league.
 * @throws 500 when there is an Internal server error processing the request.
 */
export const removeUserInLeague = async (req, res) => {
  const { leagueId, userId } = req.body;

  try {
    const league = await League.findById(leagueId);

    if (!league) {
      res.status(404).json({ message: 'League not found' });
      return;
    }

    if (!league.users.includes(userId)) {
      res.status(400).json({ message: 'User is not part of this league' });
      return;
    }

    league.users = league.users.filter((user) => user.toString() !== userId);
    await league.save();

    res.status(200).json(league);
  } catch (error) {
    console.error('Error in removeUserInLeague:', error);
    res.status(500).json({ message: 'Internal server error', error: {} });
  }
};

/**
 * Deletes a league if it has no users.
 *
 * @async
 * @function deleteLeague
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {string} req.params.leagueId - The ID of the league to delete.
 * @returns {JSON} The success message if the league is deleted in json format.
 * @throws 400 If there is existing user in the league..
 */
export const deleteLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.leagueId);

    if (league) {
      if (league.users.length > 0) {
        res
          .status(400)
          .json({ message: 'There is existing user in the league.' });
      } else {
        await league.remove();
        res.status(200).json({ message: 'League successfully deleted' });
      }
    } else {
      res.status(404).json({ message: 'League not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
