import Game from '../models/game.js';

// Create a new game
export const createGame = async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json({ game });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Get all games
export const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ games });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Update a game
export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    res.status(200).json({ game });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Delete a game
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    res.status(200).json({ game });
  } catch (error) {
    res.status(400).json({ error });
  }
};
