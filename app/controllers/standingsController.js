import { validationResult } from 'express-validator';
import Standing from '../models/standing.js';
import User from '../models/user.js';
import Guess from '../models/guess.js';
import mongoose from 'mongoose';

/***
parameter   POST
{
  "league": "60a4b4a40c12345a6789d0b1",
  "user": "60a4b4a40c12345a6789d0c1",
}

/**
 * Creates a new league standing with a specified league ID and user ID.
 *
 * @async
 * @function createLeagueStanding
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The HTTP request body containing the league and user IDs.
 * @param {string} req.body.league - The ID of the league to create the standing for.
 * @param {string} req.body.user - The ID of the user to create the standing for.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} Will throw an error if the database operation fails. The error message will be included in the response body.
 * @returns {void} Sends an HTTP response to the client with a JSON object containing the new standing object if successful, or sends an error response if unsuccessful.
 */
export const createLeagueStanding = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { league, user } = req.body;

  // Check if league or user is an array
  if (Array.isArray(league) || Array.isArray(user)) {
    return res.status(400).json({
      errors: [
        {
          msg: 'Only one league and one user value are allowed.',
        },
      ],
    });
  }

  try {
    const newStanding = new Standing({
      league,
      standings: [
        {
          user,
          points: 0,
        },
      ],
    });

    await newStanding.save();
    res.status(201).json(newStanding);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Retrieves all standings for a specified user ID.
 *
 * @async
 * @function getAllUserStandings
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.userId - The ID of the user to retrieve the standings for.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} Will throw an error if the database operation fails. The error message will be included in the response body.
 * @returns {void} Sends an HTTP response to the client with a JSON object containing the standings.
 */
export const getAllUserStandings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const standings = await Standing.find({
      'standings.user': userId,
    }).populate({
      path: 'league',
      select: 'name',
    });
    res.status(200).json(standings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Retrieves a single league standing by ID.
 *
 * @async
 * @function getStandingById
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.standing - The league standing object, retrieved from the database by the middleware.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} Will throw an error if the database operation fails. The error message will be included in the response body.
 * @returns {void} Sends an HTTP response to the client with a JSON object containing the standing.
 */
export const getStandingById = async (req, res) => {
  try {
    const standing = req.standing;

    res.status(200).json(standing);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Standing not found', error: error });
  }
};

/**
 * Retrieves a league standing by league ID, including the user and league objects.
 *
 * @async
 * @function getStandingByLeagueId
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.leagueId - The ID of the league to retrieve the standing for.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} Will throw an error if the database operation fails. The error message will be included in the response body.
 * @returns {void} Sends an HTTP response to the client with a JSON object containing the standing, including the user and league objects.
 */
export const getStandingByLeagueId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('League ID:', id);

    const standing = await Standing.findOne({ league: id })
      .populate({
        path: 'standings.user',
        select: 'fullName',
      })
      .populate({
        path: 'league',
        select: 'name',
      });

    console.log('Found standing:', standing);

    if (!standing) {
      return res
        .status(404)
        .json({ msg: 'Standing not found for the given league ID' });
    }

    res.status(200).json(standing);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

/***
parameter   PUT
{
  "league": "60a4b4a40c12345a6789d0b1",
  "standings": [
    {
      "user": "60a4b4a40c12345a6789d0c1",
      "points": 15
    },
    {
      "user": "60a4b4a40c12345a6789d0c2",
      "points": 10
    },
    {
      "user": "60a4b4a40c12345a6789d0c3",
      "points": 18
    }
  ]
}

*/

/**
 * Updates a league standing with new point values for each user.
 *
 * @async
 * @function updateStanding
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body object containing the league and new standings data.
 * @param {string} req.body.league - The ID of the league to update the standing for.
 * @param {Array} req.body.standings - An array of user objects with updated points values.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} Will throw an error if the database operation fails. The error message will be included in the response body.
 * @returns {void} Sends an HTTP response to the client with a JSON object containing the updated standing.
 */
export const updateStanding = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { league, standings } = req.body;

  try {
    const standing = await Standing.findOne({ league });

    if (!standing) {
      return res.status(404).json({ msg: 'Standing not found' });
    }

    // Update points for each user in standings
    for (const updatedUser of standings) {
      const { user, points } = updatedUser;
      const userStandingIndex = standing.standings.findIndex(
        (item) => item.user.toString() === user
      );

      if (userStandingIndex !== -1) {
        standing.standings[userStandingIndex].points = points;
      }
    }

    await standing.save();
    res.status(200).json(standing);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Deletes a standing by a league ID.
 *
 * @async
 * @function deleteStandingByLeague
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The parameters object containing the ID of the league to delete the standing for.
 * @param {string} req.params.league - The ID of the league to delete the standing for.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} Will throw an error if the database operation fails. The error message will be included in the response body.
 * @returns {void} Sends an HTTP response to the client with a JSON object containing a success message.
 */
export const deleteStandingByLeague = async (req, res) => {
  const { league } = req.params;

  try {
    const standing = await Standing.findOneAndDelete({ league });

    if (!standing) {
      return res.status(404).json({ msg: 'Standing not found' });
    }
    res.status(200).json({ msg: 'Standing deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


/**
 * Deletes a league standing by its ID.
 *
 * @async
 * @function deleteStanding
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.standing - The standing object to be deleted, as returned by the middleware that retrieves the standing from the database.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} Will throw an error if the database operation fails. The error message will be included in the response body.
 * @returns {void} Sends an HTTP response to the client with a JSON object containing a success message.
 */
export const deleteStanding = async (req, res) => {
  try {
    const { id } = req.standing;
    const standing = await Standing.findOneAndDelete({ id });

    if (!standing) {
      return res.status(404).json({ msg: 'Standing not found' });
    }
    res.status(200).json({ msg: 'Standing deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Removes the specified user from all standings they are a part of
 *
 * @async
 * @function removeUserInStanding
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters object
 * @param {string} req.params.user - The ID of the user to be removed from standings
 * @param {Object} res - Express response object
 * @throws {Error} Will throw an error if an error occurs while deleting user from standings
 * @returns {Object} The updated standing JSON object(s) after the user has been removed
 */
export const removeUserInStanding = async (req, res) => {
  const { user } = req.params;

  try {
    const standings = await Standing.find({ 'standings.user': user });

    if (!standings.length) {
      return res.status(404).json({ msg: 'User not found in any standings' });
    }

    const updatedStandings = await Promise.all(
      standings.map(async (standing) => {
        if (standing.standings.length <= 1) {
          return res.status(400).json({
            msg: 'League Standing must have at least one user.',
          });
        }

        const updatedStanding = await Standing.findByIdAndUpdate(
          standing._id,
          {
            //$pull executes the remove operation of user in standings
            $pull: { standings: { user } },
          },
          { new: true }
        );
        return updatedStanding;
      })
    );

    res.status(200).json(updatedStandings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

/**
parameter   PATCH
*{
*  "league": "60a4b4a40c12345a6789d0b1",
*  "user": "60a4b4a40c12345a6789d0c1",
* }
*/


/**
* Finds the standing with the specified league ID from the request body. 
* If the league is found in the standings, it checks if the user from the request body
* exists in the standings array.
* If the user is the only one in the standings, it will return error message. 
* Else, delete the user from the standings and returns the updated standings. 
* If the user or league is not found in any standings, it will return a 404 error

@async
 * @function removeUserStandingInLeague
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.body.league - League ID to remove user from
 * @param {string} req.body.user - User ID to remove from league standing
 * @throws {Error} 404 error if league is not found or user is not found in league standing
 * @throws {Error} 400 error if league standing only has one user
 * @returns {Object} JSON object representing the updated league standing
 */

//TODO review - name convention seems strange. the remove operation seems to be
//removing the user but not the points property in the json object

export const removeUserStandingInLeague = async (req, res) => {
  const { league, user } = req.body;

  try {
    const standing = await Standing.findOne({ league });

    if (!standing) {
      return res.status(404).json({ msg: 'League not found in standings' });
    }

    const userIndex = standing.standings.findIndex(
      (standing) => standing.user.toString() === user
    );

    if (userIndex === -1) {
      return res
        .status(404)
        .json({ msg: 'User not found in league standings' });
    }

    if (standing.standings.length <= 1) {
      return res.status(400).json({
        msg: 'League Standing must have at least one user.',
      });
    }

    standing.standings.splice(userIndex, 1);
    await standing.save();

    res.status(200).json(standing);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const joinUserInStanding = async (req, res) => {
  const { leagueId, users } = req.body;

  if (!users || users.length === 0) {
    res.status(400).json({ message: 'No users provided' });
    return;
  }

  try {
    const standing = await Standing.findOne({ league: leagueId });

    if (!standing) {
      res.status(404).json({ message: 'Standing not found' });
      return;
    }

    for (const userId of users) {
      if (!userId || userId.trim() === '') {
        res.status(400).json({ message: 'Invalid user id provided' });
        return;
      }

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ message: `User with id ${userId} not found` });
        return;
      }

      if (
        !standing.standings.some((stand) => stand.user.toString() === userId)
      ) {
        standing.standings.push({ user: userId });
      }
    }

    await standing.save();

    res.status(200).json(standing);
  } catch (error) {
    console.error('Error in joinUserInStanding:', error);
    res.status(500).json({ message: 'Internal server error', error: {} });
  }
};

export const getAllStanding = async (req, res) => {
  try {
    const standings = await Standing.find().populate({
      path: 'league standings.user',
    });

    if (!standings) {
      res.status(404).json({ message: 'No standings found' });
      return;
    }

    res.status(200).json(standings);
  } catch (error) {
    console.error('Error in getAllStanding:', error);
    res.status(500).json({ message: 'Internal server error', error: {} });
  }
};


export const calculateUsersPoints =  async (req, res) => {
  try {
    // Get the start and end dates for the current week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -5 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Find all guesses made in the current week
    const guesses = await Guess.find({
        createdAt: {
          $gte: startOfWeek,
          $lte: endOfWeek
        },
      })
      .populate('user')
      .populate('game');

    // Create a Map to store users' total points
    const userPointsMap = new Map();

    // Loop through the guesses
    for (const guess of guesses) {
      if (guess.guess === guess.game.result) {
        const userId = guess.user._id.toString();
        const leagueId = guess.game.league.toString();

        // Initialize the user points for this user and league combination
        if (!userPointsMap.has(userId)) {
          userPointsMap.set(userId, new Map());
        }
        const userLeaguesMap = userPointsMap.get(userId);

        if (!userLeaguesMap.has(leagueId)) {
          userLeaguesMap.set(leagueId, 0);
        }

        // Increment the user's points by 1
        userLeaguesMap.set(leagueId, userLeaguesMap.get(leagueId) + 1);
      }
    }

    const updatedStandings = []
    for (const [userId, userLeaguesMap] of userPointsMap.entries()) {
      for (const [leagueId, points] of userLeaguesMap.entries()) {
        const updatedStanding = await Standing.findOneAndUpdate(
          {
            'standings.user': mongoose.Types.ObjectId(userId),
            league: mongoose.Types.ObjectId(leagueId),
          },
          {
            $inc: {
              'standings.points': points,
            },
          },
          { new: true } // Return the updated document
        );
        updatedStandings.push(updatedStanding);
      }
    }
    res.status(200).json({ message: 'Standings updated', standings: updatedStandings });
  } catch (error) {
    console.error('Error updating guess points:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
