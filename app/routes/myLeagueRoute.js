import express from 'express';
import { getMyLeague } from '../controllers/myLeagueController.js';

const router = express.Router();

router.get('/myLeague/:userId', getMyLeague);

export default router;
