import Article from '../models/Article.js';

export const findArticleById = async (req, res, next) => {
  let article;
  try {
    const { id } = req.params;
    article = await Article.findById(id);
    if (article == null) {
      return res.status(404).json({ message: 'Article not found' });
    }
    req.article = article;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
