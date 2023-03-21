import { Schema, model } from 'mongoose';

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  shortdesc: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
});

const Article = model('Article', articleSchema);

export default Article;
