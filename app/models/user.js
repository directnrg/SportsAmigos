import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar:{
    type: String
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferredCurrency: {
    type: String,
    required: true,
  },
  bettingPreferences: {
    bettingSports: [String],
    bettingFrequency: String,
    riskTolerance: String,
    bettingStrategy: String,
  },
  paymentInformation: {
    depositMethod: String,
    withdrawalMethod: String,
  },
  termsAndConditions: {
    agreed: {
      type: Boolean,
      required: true,
    },
    timestamp: Date,
  },
});

const User = model('User', userSchema);

export default User;