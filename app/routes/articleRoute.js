import express from 'express';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';
import { findArticleById } from '../middleware/articleMiddleware.js';

const router = express.Router();

router.get('/articles', getAllArticles);
router.get('/article/:id', findArticleById, getArticleById);
router.post('/article', createArticle);
router.put('/article/:id', findArticleById, updateArticle);
router.delete('/article/:id', findArticleById, deleteArticle);

// Add a catch-all route to return a 404 error for /api/article without an ID
router.all('/article', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default router;
