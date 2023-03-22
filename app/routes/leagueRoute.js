import express from 'express';
import {
  createLeague,
  getLeagues,
  getLeague,
  updateLeague,
  deleteLeague,
} from '../controllers/leagueController.js';
import { checkLeagueAdmin } from '../middleware/checkLeagueAdmin.js';

const router = express.Router();

router.get('/leagues', getLeagues);
router.post('/league', createLeague);
router.get('/league/:leagueId', getLeague);
//route that require middleware to check permission first 
//router.put('/league/:leagueId', checkLeagueAdmin, updateLeague); 
//router.delete('/league/:leagueId', checkLeagueAdmin, deleteLeague);

//bypassing middleware 
router.put('/league/:leagueId', updateLeague);
router.delete('/league/:leagueId', deleteLeague);

// Add a catch-all route to return a 404 error for /api/article without an ID
router.all('/league', (req, res) => {
  res.status(404).json({ error: 'API Not Found' });
});

export default router;
