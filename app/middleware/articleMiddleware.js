import Article from '../models/Article.js';

export const findArticleById = async (req, res, next) => {
  let article;
  try {
    article = await Article.findById(req.params.id);
    if (article == null) {
      return res.status(404).json({ message: 'Article not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  req.article = article;
  next();
};
