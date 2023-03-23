import League from '../models/league.js';

export const createLeague = async (req, res) => {
  try {
    const league = new League(req.body);
    await league.save();
    res.status(201).json(league);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getLeagues = async (req, res) => {
  try {
    const leagues = await League.find().populate('users guesses games');
    res.status(200).json(leagues);
  } catch (error) {
    console.error('Error in getLeagues:', error); // Log the error to the console
    res.status(500).json({ message: 'Internal server error', error });
  }
};


export const getLeague = async (req, res) => {
  try {
    const league = await League.findById(req.params.leagueId).populate('users guesses games');
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

export const updateLeague = async (req, res) => {
  const { leagueId } = req.params;

  const updatedLeagueData = req.body;

  try {
    const league = await League.findByIdAndUpdate(
      leagueId,
      updatedLeagueData,
      { new: true, runValidators: true }
    );

    if (!league) {
      res.status(404).json({ message: 'League not found' });
      return;
    }

    res.status(200).json(league);
  } catch (error) {
    console.error('Error in updateLeague:', error);
    res.status(500).json({ message: 'Internal server error', error: {} });
  }
};




export const deleteLeague = async (req, res) => {
  try {
    const league = await League.findByIdAndRemove(req.params.leagueId);

    if (league) {
      res.status(200).json({ message: 'League successfully deleted' });
    } else {
      res.status(404).json({ message: 'League not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
