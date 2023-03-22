import League from '../models/league.js';
import Guess from '../models/guess.js';

export const getMyLeague = async (req, res) => {
  try {
    const userId = req.params.userId;

    const leagues = await League.find({ users: userId })
      .populate('games guesses')
      .exec();

    const guesses = await Guess.find({ user: userId }).populate('game').exec();

    const games = [];
    const isPrivate = [];
    const leagueNames = [];
    leagues.forEach((league) => {
      league.games.forEach((game) => {
        if (!games.some((g) => g._id.toString() === game._id.toString())) {
          games.push(game);
        }
      });
      isPrivate.push(league.isPrivate);
      leagueNames.push(league.name);
    });

    const totalBetAmount = guesses.reduce(
      (total, guess) => total + guess.betamount,
      0
    );

    const myLeagueView = {
      user: userId,
      leagues,
      guesses,
      games,
      totalBetAmount,
      isPrivate,
      leagueNames,
    };

    res.status(200).json(myLeagueView);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
