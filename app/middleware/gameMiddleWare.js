import Game from "../models/game.js"

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