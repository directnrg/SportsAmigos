import { Schema, model } from 'mongoose';

const articleSchema = new Schema({
 
});

const Article = model('Article', articleSchema);

export default Article;