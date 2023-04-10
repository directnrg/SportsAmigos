import express from 'express';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';
import {findArticleById} from '../middleware/articleMiddleware.js'

const articleRouter = express.Router();

articleRouter.get('/articles', getAllArticles);
articleRouter.get('/article/:id', findArticleById, getArticleById);
articleRouter.post('/article', createArticle);
articleRouter.put('/article/:id', findArticleById, updateArticle);
articleRouter.delete('/article/:id', findArticleById, deleteArticle);

// Add a catch-all route to return a 404 error for /api/article without an ID
articleRouter.all('/article', (req, res) => {
  res.status(404).json({ error: 'Article Not Found' });
});

export default articleRouter;
