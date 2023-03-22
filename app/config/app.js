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
import myLeagueRoute from '../routes/myLeagueRoute.js'; // Import the new route

app.use('/api/', userRouter);
app.use('/api/', articleRoute);
app.use('/api/', myLeagueRoute); // Add the new route to the middleware stack

export default app;
