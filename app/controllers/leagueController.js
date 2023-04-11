import League from '../models/league.js';
import Guess from '../models/guess.js';

export const createLeague = async (req, res) => {
  try {
    const league = new League(req.body);
    await league.save();
    res.status(201).json(league);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};



export const getAllLeaguesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const leagues = await League.find({ users: userId })
      .populate([
        'games',
        'guesses',
        { path: 'users', select: '_id fullName' },
      ])
      .exec();

    res.status(200).json(leagues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//TODO - add documentation for methods
/**
 *
 */
export const getLeagues = async (req, res) => {
  try {
    const leagues = await League.find()
      .populate('users')
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

    res.status(200).json(leagues);
  } catch (error) {
    console.error('Error in getLeagues:', error); // Log the error to the console
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.leagueId)
      .populate('users')
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

    if (league) {
      res.status(200).json(league);
    } else {
      res.status(404).json({ message: 'League not found' });
    }
  } catch (error) {
    console.error('Error in getLeague:', error); // Log the error to the console
    res.status(500).json({ message: 'Internal server error', error });
  }
};

//TODO - add documentation for methods
/**
 *
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
    console.error('Error in updateLeague:', error);
    res.status(500).json({ message: 'Internal server error', error: error });
  }
};

//TODO - add documentation for methods
/**
 *
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
