import mongoose, { model, Schema } from 'mongoose';

const walletSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  funds: {
    type: Number,
    default: 0
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['deposit', 'withdrawal'],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      description: {
        type: String
      }
    }
  ]
});

const Wallet = model('Wallet', walletSchema);

export default Wallet;
