import Game from "../models/game.js"

// Get a single game by id
export const getGameById = async (req, res, next) => {
  let game;
  try {
    game = await Game.findById(req.params.gameId);
    
  } catch (error) {
    res.status(400).json({ error });
  }

  req.game = game;
    next();
};