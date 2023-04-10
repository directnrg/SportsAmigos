import Guess from "../models/guess.js";

export const findGuessById = async (req, res, next) => {
    let guess;
    try {
        const { guessId } = req.params;
        guess = await Guess.findById(guessId).populate('user').populate('game');
        if (!guess) {
            return res.status(404).json({ message: 'Guess not found' });
        }
        req.guess = guess
        next();
    } catch (error) {
        res.status(400).json({ message: 'Error fetching guess', error: error });
    }
}
