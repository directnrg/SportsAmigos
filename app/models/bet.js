import { model, Schema } from 'mongoose';

const betSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    betType: {
        type: String,
        enum: ['moneyline', 'spread', 'total', 'parlay', 'prop', 'futures'],
        required: true,
    },
    sport: {
        type: String,
        required: true,
    },
    event: {
        type: String,
        required: true,
    },
    teams: [
        {
            teamName: {
                type: String,
                required: true,
            },
            odds: {
                type: Number,
                required: true,
            },
        },
    ],
    stake: {
        type: Number,
        required: true,
    },
    potentialPayout: {
        type: Number,
        required: true,
    },
    betStatus: {
        type: String,
        enum: ['open', 'won', 'lost', 'canceled', 'pending'],
        default: 'open',
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },
});


const Bet = model('Bet', betSchema);

export default Bet;