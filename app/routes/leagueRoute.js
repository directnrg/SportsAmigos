import express from 'express';
import {
  createLeague,
  getLeagues,
  getLeague,
  updateLeague,
  deleteLeague,
} from '../controllers/leagueController.js';
import { checkLeagueAdmin } from '../middleware/checkLeagueAdmin.js';

const leagueRouter = express.Router();

leagueRouter.get('/leagues', getLeagues);
leagueRouter.post('/league', createLeague);
leagueRouter.get('/league/:leagueId', getLeague);
//leagueRouter that require middleware to check permission first 
//leagueRouter.put('/league/:leagueId', checkLeagueAdmin, updateLeague); 
//leagueRouter.delete('/league/:leagueId', checkLeagueAdmin, deleteLeague);

//bypassing middleware 
leagueRouter.put('/league/:leagueId', updateLeague);
leagueRouter.delete('/league/:leagueId', deleteLeague);

// Add a catch-all route to return a 404 error for /api/article without an ID
leagueRouter.all('/league', (req, res) => {
  res.status(404).json({ error: 'API Not Found' });
});

export default leagueRouter;
