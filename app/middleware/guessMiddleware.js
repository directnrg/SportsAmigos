import Guess from '../models/guess.js';
import League from '../models/league.js';

export const findGuessById = async (req, res, next) => {
  let guess;
  try {
    const { guessId } = req.params;
    guess = await Guess.findById(guessId).populate('user').populate('game');
    if (!guess) {
      return res.status(404).json({ message: 'Guess not found' });
    }
    req.guess = guess;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Error fetching guess', error: error });
  }
};

export const checkGuessUsage = async (req, res, next) => {
  const guessId = req.params.guessId;

  try {
    const guessInLeague = await League.findOne({ guesses: guessId });

    if (guessInLeague) {
      return res.status(400).json({
        error: 'Cannot delete Guess because it is being used by a user.',
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
