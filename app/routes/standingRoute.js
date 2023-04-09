import express from 'express';
import { check } from 'express-validator';
import {
  removeUserInStanding,
  createLeagueStanding,
  getAllUserStandings,
  getStanding,
  updateStanding,
  deleteStanding,
  removeUserStandingInLeague
} from '../controllers/standingsController.js';

const standingRouter = express.Router();

standingRouter.post(
  '/standings',
  [
    check('league', 'league is required').notEmpty(),
    check('user', 'user is required').notEmpty(),
  ],
  createLeagueStanding
);

standingRouter.put(
  '/standings',
  [
    check('league', 'league is required').notEmpty(),
    check('standings', 'standings is required').isArray({ min: 1 }),
    check('standings.*.user', 'standings user is required').notEmpty(),
    check('standings.*.points', 'standings points is required').isInt({
      min: 0,
    }),
  ],
  updateStanding
);  // look for the Standings record with specified league and user and update only the points

standingRouter.get('/standings/league/:id', getStanding); //  accepts a League.id as a parameter and returns the standings for that league
standingRouter.get('/standings/user/:id', getAllUserStandings); //accepts a User.id as a parameter and returns a list of standings where this User.id belongs to
standingRouter.delete('/standings/league/:league', deleteStanding); // delete all standing belong to that league
standingRouter.patch('/standings/remove-user/:user', removeUserInStanding); // delete specified user in All standing
standingRouter.patch('/standings/remove-user', removeUserStandingInLeague); // delete specified user in specified league in the standing


export default standingRouter;
