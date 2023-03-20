import Bet from '../models/bet';


//middleware function to get the bet by mongo id
const getBet = async (req, res, next) => {
  let bet;
  console.log("req.params in getBet", req.params)
  try {
    bet = await Bet.findById(req.params.id);
    console.log("bet inside getBet", bet)
    if (bet == null) {
      return res.status(404).json({ message: 'Cannot find a match for a bet' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.bet = bet;
  next();
}


const getBetByBetName = async (req, res, next) => {
  try {
    const betId = req.params.betId; // Assuming the bet ID is provided in the URL as a route parameter
    const bet = await Bet.findOne({ betId });

    if (!bet) {
      return res.status(404).json({ message: 'No bets found for this bet' });
    } 

    res.bet = bet;
    next();
  } catch (err) {
    console.error('Error retrieving bets by bet:', err);
    res.status(500).json({ message: 'Error retrieving bets by bet' });
  }
};

export { getBet, getBetByBetName }
