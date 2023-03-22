import Article from '../models/Article.js';

// Get all articles
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get an article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new article
export const createArticle = async (req, res) => {
  const { title, shortdesc, content, author, image } = req.body;

  const newArticle = new Article({
    title,
    shortdesc,
    content,
    author,
    image,
  });

  try {
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an article by ID
export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an article by ID
export const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    res.json(deletedArticle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
