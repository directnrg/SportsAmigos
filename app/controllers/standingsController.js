import Standing from '../models/standing.js';

export const getAllStandings = async (req, res) => {
  try {
    const userLeagues = await Standing.find().populate('user').populate('league');
    res.status(200).json(userLeagues);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user-leagues', error });
  }
};

//User league holds the standings per user per league.
export const getStanding = async (req, res) => {
  try {
    const standing = req.standing;
    res.status(200).json(standing);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching standing of user', error });
  }
};

export const getStandingsByLeague = async (req, res) => {
  try {
    const standings = req.standings;
    const mapStandings = standings.map((standing) => ({
      userName: standing.user.fullName,
      leagueName: standing.league.name,
      points: standing.points
    }));

    //sorting standings based points in descending order
    mapStandings.sort((a,b) => b.points - a.points);

    res.status(200).json(mapStandings);
  } catch (err) {
    console.error("Error trying to get standings with minimized data", err);
    res.status(500).json({message : err.message });
  }
}

// method that might be used for manipulating data as an admin. regular usage will be very low.
export const updateStanding = async (req, res) => {
  try {
    const { user, league, points, betAmount } = req.body;
    const updatedStanding = await Standing.findOneAndUpdate(
      {_id: req.standing._id},
      { user, league, points, betAmount },
      { new: true }
    );
    if (!updatedStanding) {
      return res.status(404).json({ message: 'User standing not found' });
    }
    res.status(200).json(updatedStanding);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user standing', error });
  }
};

export const deleteStanding = async (req, res) => {
  try {
    const { id } = req.standing._id;
    const deletedStanding = await Standing.findOneAndDelete(id);
    if (!deletedStanding) {
      return res.status(404).json({ message: 'User standing not found' });
    }
    res.status(200).json({ message: 'User standings deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user Standings', error });
  }
};