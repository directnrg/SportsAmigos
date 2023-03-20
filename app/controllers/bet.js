import Bet from '../models/bet.js';

const getAllbets = async (req, res) => {
  try {
    const bets = await Bet.find();
    res.status(200).json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bets', error });
  }
};

const showBetById = async (req, res) => {
    res.json(res.user);
};

const showBetByBetName = async (req, res) => {
    res.json(res.user);
};

const addBet = async (req, res) => {
  try {
    const newBet = new Bet(req.body);
    const savedBet = await newBet.save();
    res.status(201).json(savedBet);
  } catch (error) {
    res.status(500).json({ message: 'Error creating bet', error });
  }
};

const updateBetById = async (req, res) => {
  try {
    const updatedBet = await Bet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bet', error });
  }
};

const deleteBetById = async (req, res) => {
  try {
    await Bet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bet deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bet', error });
  }
};

export { getAllbets, showBetById, showBetByBetName, addBet, updateBetById, deleteBetById };
