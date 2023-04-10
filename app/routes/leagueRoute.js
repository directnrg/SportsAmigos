import express from 'express';
import {
  createLeague,
  getMyLeague,
  getLeagues,
  getLeague,
  updateLeagueName,
  deleteLeague,
  userJoinLeague,
  removeUserInLeague,
} from '../controllers/leagueController.js';

const leagueRouter = express.Router();

leagueRouter.get('/leagues', getLeagues); //return all leagues
leagueRouter.get('/league/:userId', getMyLeague);
leagueRouter.post('/league', createLeague); //create a League
leagueRouter.get('/league/:leagueId', getLeague); //get specific league
leagueRouter.patch('/league/join', userJoinLeague); //join user to existing league. Parameter JSON body "leagueId" & "userId"
leagueRouter.patch('/league/remove-user', removeUserInLeague); //Remove user from existing league. Parameter JSON body "leagueId" & "userId"
leagueRouter.put('/league/:leagueId', updateLeagueName); //Rename the league name. Parameter JSON body "name"
leagueRouter.delete('/league/delete/:leagueId', deleteLeague); //Delete league without existing user(s)

// Add a catch-all route to return a 404 error for /api/article without an ID
leagueRouter.all('/league', (req, res) => {
  res.status(404).json({ error: 'API Not Found' });
});

export default leagueRouter;
