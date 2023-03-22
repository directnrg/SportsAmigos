import League from '../models/league.js';

export const checkLeagueAdmin = async (req, res, next) => {
  const { leagueId } = req.params;
  const userId = req.user._id;

  console.log('Executing checkLeagueAdmin middleware'); // Log middleware execution

  try {
    const league = await League.findById(leagueId);

    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }

    const isAdmin = league.users.some(
      (user) => user.toString() === userId.toString()
    );

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to manage this league' });
    }

    console.log('checkLeagueAdmin middleware passed'); // Log successful middleware execution

    next();
  } catch (error) {
    console.error('Error in checkLeagueAdmin middleware:', error); // Log error in middleware
    res.status(500).json({ message: 'Internal server error', error });
  }
};
