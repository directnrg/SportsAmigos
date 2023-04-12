import Article from '../models/Article.js';

/**
 * Retrieve all articles.
 *
 * @async
 * @function getAllArticles
 * @param {Object} req - Express request object
 * @param {Promise} res - Express response object
 * @throws 500 error if there is an internal server error
 * @returns {JSON} JSON object representing the list of articles
 */
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get an article by ID.
 *
 * @async
 * @function getArticleById
 * @param {Object} req - Express request object
 * @param {Object} req.article - The article object retrieved from the database
 * @param {Promise} res - Express response object
 * @throws 500 error if there is an error in retrieving the article from the database
 * @returns {JSON} JSON object representing the article
 */
export const getArticleById = async (req, res) => {
  try {
    const article = req.article;
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Create a new article.
 *
 * @async
 * @function createArticle
 * @param {Object} req - Express request object
 * @param {Object} req.body - The request body containing the article information
 * @param {string} req.body.title - The title of the article
 * @param {string} req.body.shortdesc - A short description of the article
 * @param {string} req.body.content - The content of the article
 * @param {string} req.body.author - The author of the article
 * @param {string} req.body.image - The URL of the image for the article
 * @param {Promise} res - Express response object
 * @returns {JSON} JSON object representing the created article
 * @throws 400 error if there is an error in the request body
 * 
 */
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

/**
 * Updates an existing article with new data.
 * 
 * @async
 * @function updateArticle
 * @param {Object} req - Express request object
 * @param {Object} req.article - Article object obtained from middleware
 * @param {Object} req.body - New article data to be updated
 * @param {string} req.body.title - Updated title of the article
 * @param {string} req.body.content - Updated content of the article
 * @param {Promise} res - Express response object
 * @returns {JSON} JSON object representing the updated article
 * @throws 400 error if validation of updated article data fails
 */
export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findOneAndUpdate(
      {_id: req.article._id},
      { $set: req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Deletes an article by ID
 *
 * @async
 * @function deleteArticle
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {string} req.article.id ID of the article to be deleted
 * @param {Promise} res - Express response object
 * @returns {JSON} JSON object representing the deleted article
 * @throws 500 error if there is an error deleting the record with the database
 */
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.article
    const deletedArticle = await Article.deleteOne({ _id: id});
    res.status(200).json(deletedArticle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
