import UserLeague from '../models/UserLeague.mjs';

export const createUserLeague = async (req, res) => {
  try {
    const { user, league, points, betAmount } = req.body;
    const newUserLeague = new UserLeague({ user, league, points, betAmount });
    await newUserLeague.save();
    res.status(201).json(newUserLeague);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user-league', error });
  }
};

export const getAllUserLeagues = async (req, res) => {
  try {
    const userLeagues = await UserLeague.find().populate('user').populate('league');
    res.status(200).json(userLeagues);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user-leagues', error });
  }
};

export const getUserLeagueById = async (req, res) => {
  try {
    const { id } = req.params;
    const userLeague = await UserLeague.findById(id).populate('user').populate('league');
    if (!userLeague) {
      return res.status(404).json({ message: 'User-league not found' });
    }
    res.status(200).json(userLeague);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user-league', error });
  }
};

export const updateUserLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, league, points, betAmount } = req.body;
    const updatedUserLeague = await UserLeague.findByIdAndUpdate(
      id,
      { user, league, points, betAmount },
      { new: true }
    );
    if (!updatedUserLeague) {
      return res.status(404).json({ message: 'User-league not found' });
    }
    res.status(200).json(updatedUserLeague);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user-league', error });
  }
};

export const deleteUserLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUserLeague = await UserLeague.findByIdAndDelete(id);
    if (!deletedUserLeague) {
      return res.status(404).json({ message: 'User-league not found' });
    }
    res.status(200).json({ message: 'User-league deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user-league', error });
  }
};