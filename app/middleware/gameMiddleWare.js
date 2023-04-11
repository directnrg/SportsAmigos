import Game from '../models/game.js';
import League from '../models/league.js';

// Get a single game by id - mongodb id
export const findGameById = async (req, res, next) => {
  let game;
  try {
    const { gameId } = req.params;
    game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    req.game = game;
    next();
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const checkGameUsage = async (req, res, next) => {
  const gameId = req.params.gameId;

  try {
    const gameInLeague = await League.findOne({ games: gameId });
    const gameInGuess = await Guess.findOne({ game: gameId });

    if (gameInLeague || gameInGuess) {
      return res.status(400).json({
        error: 'Cannot delete Game because it is being used by a user.',
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
