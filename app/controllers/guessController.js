import Guess from '../models/guess.js'
import Game from '../models/game.js';
import Standing from '../models/standing.js';

export const createGuess = async (req, res) => {
    try {
        const newGuess = new Guess(req.body);
        await newGuess.save();
        const populatedGuess = await Guess.findById(newGuess._id).populate('user').populate('game');
        res.status(201).json({ message: 'Created guess object', data: populatedGuess });
    } catch (error) {
        res.status(400).json({ message: 'Error creating guess', error });
    }
}

export const getAllGuesses = async (req, res) => {
    try {
        const guesses = await Guess.find().populate('user').populate('game');
        res.status(200).json(guesses);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching guesses', error });
    }
}

export const getGuessById = async (req, res) => {
    try {
        const { id } = req.params;
        const guess = await Guess.findById(id).populate('user').populate('game');
        if (!guess) {
            return res.status(404).json({ message: 'Guess not found' });
        }
        res.status(200).json(guess);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching guess', error });
    }
}

export const updateGuess = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, betamount, game, guess, userPoints } = req.body;
        const updatedGuess = await Guess.findByIdAndUpdate(
            id,
            { user, betamount, game, guess, userPoints },
            { new: true, runValidators: true }
        );
        if (!updatedGuess) {
            return res.status(404).json({ message: 'Guess not found' });
        }
        res.status(200).json(updatedGuess);
    } catch (error) {
        res.status(400).json({ message: 'Error updating guess', error });
    }
}

export const deleteGuess = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGuess = await Guess.findByIdAndDelete(id);
        if (!deletedGuess) {
            return res.status(404).json({ message: 'Guess not found' });
        }
        res.status(200).json({ message: 'Guess deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting guess', error });
    }
}

//function to calculate the guesses done in a week
export const updateGuessPoints = async () => {
    try {
        // Get the start and end dates for the current week
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        // Find all guesses made in the current week
        const guesses = await Guess.find({
            createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        })
            .populate('user')
            .populate('game');

        for (const guess of guesses) {
            if (guess.guess === guess.game.result) {
                // Find the Standing record for the user in the league
                let standing = await Standing.findOne({
                    user: guess.user._id,
                    league: guess.game.league,
                });
                if (!standing) {
                    standing = new Standing({
                        user: guess.user._id,
                        league: guess.game.league,
                        points: 0
                    })
                }

                // Increment the user's points by 1
                standing.points += 1;
                await standing.save();
            }
        }
    } catch (error) {
        console.error('Error updating guess points:', error);
    }
};

