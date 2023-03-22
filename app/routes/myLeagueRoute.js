import express from 'express';
import User from '../models/user.js';
import League from '../models/league.js';
import Guess from '../models/guess.js';
import Game from '../models/game.js';

const router = express.Router();

router.get('/myLeague/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Get leagues belonging to the user
      const leagues = await League.find({ users: userId }).populate('games guesses').exec();
  
      // Get guesses belonging to the user
      const guesses = await Guess.find({ user: userId }).populate('game').exec();
  
      // Get games belonging to the user
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
  
      // Calculate the total bet amount for the user
      const totalBetAmount = guesses.reduce((total, guess) => total + guess.betamount, 0);
  
      // Create a view object
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
  });
   

  export default router;

  