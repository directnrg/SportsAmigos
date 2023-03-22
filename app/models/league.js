import mongoose, { Schema, model } from 'mongoose';

const leagueSchema = new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    name: {
        type: String,
        required: true,
    },
    guesses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guess',
    }],
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    }],
    isPrivate: {
        type: Boolean,
        default: false,
    },
});

const League = model('League', leagueSchema);

export default League;
