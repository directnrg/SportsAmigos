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

router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.post('/', createArticle);
router.put('/:id', findArticleById, updateArticle);
router.delete('/:id', findArticleById, deleteArticle);

export default router;
