import Standing from '../models/standing.js';
import { check, validationResult } from 'express-validator';

/***
parameter   POST
{
  "league": "60a4b4a40c12345a6789d0b1",
  "user": "60a4b4a40c12345a6789d0c1",
}
//Create a League
***/

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

/***
parameter   GET User.id
//Get League standing belong to user
***/
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

export const getStandingById = async (req, res) => {
  try {
    const standing = req.standing;

    res.status(200).json(standing);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Standing not found", error: error });
  }
}

/***
parameter   GET League.id
//Standings for that league
***/
export const getStandingByLeagueId = async (req, res) => {
  try {
    const { leagueId } = req.params;
    const standing = await Standing.findOne({ league: leagueId })
      .populate({
        path: 'standings.user',
        select: 'fullName',
      })
      .populate({
        path: 'league',
        select: 'name',
      });

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
//Update user points for the league
***/

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
 * This method will first find the standing with the specified league ID from the request parameters.. 
 * If the standing is not found, it will return a 404 error.
 * @param req.standing 
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
 * To delete a standing by mongo db id
 * @param req 
 * @param res 
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
*parameter   PATCH user.id
*
*This method will first find all the standings with the specified user ID from the request parameters. 
* If the user exists in any standings:
* If the user is the only one in the standings, it will return error message.
* Else, delete the user from the standings and returns the updated standings. 
* If the user is not found in any standings, it will return a 404 error.
**/

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
* This method will first find the standing with the specified league ID from the request body. 
* If the league is found in the standings, it checks if the user from the request body
* exists in the standings array.
* If the user is the only one in the standings, it will return error message. 
* Else, delete the user from the standings and returns the updated standings. 
* If the user or league is not found in any standings, it will return a 404 error
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
      return res.status(404).json({ msg: 'User not found in league standings' });
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
