import express from 'express';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';

const articleRouter = express.Router();

articleRouter.get('/articles', getAllArticles);
articleRouter.get('/article/:id', getArticleById);
articleRouter.post('/article', createArticle);
articleRouter.put('/article/:id', updateArticle);
articleRouter.delete('/article/:id', deleteArticle);

// Add a catch-all route to return a 404 error for /api/article without an ID
articleRouter.all('/article', (req, res) => {
  res.status(404).json({ error: 'Article Not Found' });
});

export default articleRouter;
