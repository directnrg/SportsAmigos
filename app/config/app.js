import express, { json } from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import cors from 'cors';
const { connect, connection } = mongoose;
import dotenv from 'dotenv';

//app
const app = express();

//environment variables
dotenv.config();

connect(process.env.APP_DATABASE_URL, {
  useNewUrlParser: true,
});
const db = connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB Atlas'));

app.use(json());
app.use(cors());

//construct absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsPath = resolve(__dirname, '../views');

// default view engine
app.set('views', viewsPath);
app.set('view engine', 'ejs');

//routing
import { userRouter } from '../routes/user.js';
import articleRoute from '../routes/articleRoute.js';

app.use('/api/', userRouter);
app.use('/api/article', articleRoute);

//test users autopopulate
// const arrayUsers =
// [
//     {
//         "fullName": "John Doe",
//         "dateOfBirth": "1990-01-01",
//         "email": "john.doe@example.com",
//         "avatar": "https://example.com/avatar/johndoe.jpg",
//         "phone": "+1-555-123-4567",
//         "address": {
//           "country": "Canada",
//           "province": "Ontario",
//           "city": "Toronto",
//           "street": "123 Maple St",
//           "postalCode": "M1A 2B3"
//         },
//         "username": "johndoe90",
//         "password": "SecurePassword123",
//         "preferredCurrency": "CAD",
//         "bettingPreferences": {
//           "bettingSports": ["Hockey", "Basketball"],
//           "bettingFrequency": "weekly",
//           "riskTolerance": "medium",
//           "bettingStrategy": "spread"
//         },
//         "paymentInformation": {
//           "depositMethod": "credit_card",
//           "withdrawalMethod": "bank_transfer"
//         },
//         "termsAndConditions": {
//           "agreed": true,
//           "timestamp": "2023-03-19T00:00:00Z"
//         }
//     },
//     {
//         "fullName": "Jane Smith",
//         "dateOfBirth": "1985-02-14",
//         "email": "jane.smith@example.com",
//         "avatar": "https://example.com/avatar/janesmith.jpg",
//         "phone": "+1-555-987-6543",
//         "address": {
//           "country": "Canada",
//           "province": "British Columbia",
//           "city": "Vancouver",
//           "street": "456 Oak St",
//           "postalCode": "V5K 0A1"
//         },
//         "username": "janesmith85",
//         "password": "StrongPassword123",
//         "preferredCurrency": "CAD",
//         "bettingPreferences": {
//           "bettingSports": ["Baseball", "Soccer"],
//           "bettingFrequency": "monthly",
//           "riskTolerance": "low",
//           "bettingStrategy": "moneyline"
//         },
//         "paymentInformation": {
//           "depositMethod": "e-transfer",
//           "withdrawalMethod": "e-transfer"
//         },
//         "termsAndConditions": {
//           "agreed": true,
//           "timestamp": "2023-03-19T00:00:00Z"
//         }
//     },
//     {
//         "fullName": "Michael Brown",
//         "dateOfBirth": "1992-08-05",
//         "email": "michael.brown@example.com",
//         "avatar": "https://example.com/avatar/michaelbrown.jpg",
//         "phone": "+1-555-555-1234",
//         "address": {
//           "country": "Canada",
//           "province": "Quebec",
//           "city": "Montreal",
//           "street": "789 Pine St",
//           "postalCode": "H3Z 2Y7"
//         },
//         "username": "michaelbrown92",
//         "password": "SafePassw0rd789",
//         "preferredCurrency": "CAD",
//         "bettingPreferences": {
//           "bettingSports": ["Hockey", "Football"],
//           "bettingFrequency": "daily",
//           "riskTolerance": "high",
//           "bettingStrategy": "over_under"
//         },
//         "paymentInformation": {
//           "depositMethod": "credit_card",
//           "withdrawalMethod": "bank_transfer"
//         },
//         "termsAndConditions": {
//           "agreed": true,
//           "timestamp": "2023-03-19T00:00:00Z"
//         }
//     },
//     {
//         "fullName": "Emily Johnson",
//         "dateOfBirth": "1996-11-12",
//         "email": "emily.johnson@example.com",
//         "avatar": "https://example.com/avatar/emilyjohnson.jpg",
//         "phone": "+1-555-789-0123",
//         "address": {
//           "country": "Canada",
//           "province": "Alberta",
//           "city": "Calgary",
//           "street": "321 Elm St",
//           "postalCode": "T2P 2Y9"
//         },
//         "username": "emilyjohnson96",
//         "password": "ComplexP@ssw0rd",
//         "preferredCurrency": "CAD",
//         "bettingPreferences": {
//           "bettingSports": ["Tennis", "Golf"],
//           "bettingFrequency": "occasionally",
//           "riskTolerance": "medium",
//           "bettingStrategy": "outright"
//         },
//         "paymentInformation": {
//           "depositMethod": "e-transfer",
//           "withdrawalMethod": "e-transfer"
//           },
//         "termsAndConditions": {
//           "agreed": true,
//           "timestamp": "2023-03-19T00:00:00Z"
//         }
//     },
//     {
//         "fullName": "William Garcia",
//         "dateOfBirth": "1980-06-30",
//         "email": "william.garcia@example.com",
//         "avatar": "https://example.com/avatar/williamgarcia.jpg",
//         "phone": "+1-555-444-5555",
//         "address": {
//           "country": "Canada",
//           "province": "Manitoba",
//           "city": "Winnipeg",
//           "street": "258 Birch St",
//           "postalCode": "R3B 2H8"
//         },
//         "username": "williamgarcia80",
//         "password": "PasswordSecure456",
//         "preferredCurrency": "CAD",
//         "bettingPreferences": {
//           "bettingSports": ["Basketball", "Hockey"],
//           "bettingFrequency": "weekly",
//           "riskTolerance": "medium",
//           "bettingStrategy": "spread"
//         },
//         "paymentInformation": {
//           "depositMethod": "credit_card",
//           "withdrawalMethod": "bank_transfer"
//         },
//         "termsAndConditions": {
//           "agreed": true,
//           "timestamp": "2023-03-19T00:00:00Z"
//         }
//     }
// ]

// arrayUsers.forEach(async function (user) {

//     const foundUser = await User.findOneAndUpdate(user, user, {
//         upsert: true
//     });

// });

export default app;
