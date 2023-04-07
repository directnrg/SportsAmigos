import express from 'express';
import { getAllStandings, getStandingsByLeague, getStanding, updateStanding, deleteStanding} from '../controllers/standingsController.js';
import { getStandingById, getStandingByLeagueId } from '../middleware/standingsMiddleware.js';

const standingRouter = express.Router();

standingRouter.get('/standings', getAllStandings);
standingRouter.get('/standings/:leagueId', getStandingByLeagueId, getStandingsByLeague)
standingRouter.get('/standing/:id', getStandingById, getStanding);
standingRouter.put('/standing/:id', getStandingById, updateStanding);
standingRouter.delete('/standing/:id', getStandingById, deleteStanding);

export default standingRouter;