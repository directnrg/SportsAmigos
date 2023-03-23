import express from 'express';
import { getMyLeague } from '../controllers/myLeagueController.js';

const myLeagueRouter = express.Router();

myLeagueRouter.get('/myLeague/:userId', getMyLeague);

export default myLeagueRouter;
