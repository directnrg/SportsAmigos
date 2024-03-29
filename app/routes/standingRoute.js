import express from 'express';
import { check } from 'express-validator';
import {
  removeUserInStanding,
  createLeagueStanding,
  updateStandingPointsByLeagueId,
  getAllUserStandings,
  getStandingById,
  getStandingByLeagueId,
  updateStanding,
  deleteStanding,
  deleteStandingByLeague,
  removeUserStandingInLeague,
  joinUserInStandingByLeagueId,
  getAllStanding,
} from '../controllers/standingsController.js';
import { findStandingById } from '../middleware/standingsMiddleware.js';

const standingRouter = express.Router();

standingRouter.post(
  '/standings',
  [
    check('leagueId', 'league is required').notEmpty(),
    check('users', 'user(s) is required').notEmpty(),
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
); // look for the Standings record with specified league and user and update only the points

standingRouter.put('/update-points-league/:leagueId', updateStandingPointsByLeagueId ) // to update all the standing points based on user guesses per league
standingRouter.get('/standing/:id', findStandingById, getStandingById); // find a standing by its mongo Id
standingRouter.get('/standing/league/:id', getStandingByLeagueId); //  accepts a League.id as a parameter and returns the standings for that league
standingRouter.get('/standings/user/:id', getAllUserStandings); //accepts a User.id as a parameter and returns a list of standings where this User.id belongs to
standingRouter.delete('/standing/:id', findStandingById, deleteStanding); //delete a standing by Id 
standingRouter.delete('/stasnding/league/:league', deleteStandingByLeague); // delete a standing that belongs to a league
standingRouter.patch('/standings/remove-user/:user', removeUserInStanding); // delete specified user in All standings
standingRouter.patch('/standing/remove-user', removeUserStandingInLeague); // delete specified user in specified league in the standing
standingRouter.patch('/standing/join-users', joinUserInStandingByLeagueId);
standingRouter.get('/standings/all', getAllStanding);

export default standingRouter;
