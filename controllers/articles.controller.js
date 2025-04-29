const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;

  return selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  return selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;

  const checkArticleId = selectArticleById(articleId);
  const selectCommentsByArticle = selectCommentsByArticleId(articleId);

  Promise.all([selectCommentsByArticle, checkArticleId])
    .then((result) => {
      res.status(200).send({ comments: result[0] });
    })
    .catch(next);
};
