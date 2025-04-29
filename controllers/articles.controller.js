const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentForArticle,
  selectUserByUsername,
  updateArticleById,
  selectCommentById,
  deleteCommentById,
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

exports.postCommentForArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const commentBody = req.body;

  const checkArticleId = selectArticleById(articleId);
  const checkUsername = selectUserByUsername(commentBody.username);
  const insertComment = insertCommentForArticle(articleId, commentBody);

  Promise.all([insertComment, checkArticleId, checkUsername])
    .then((result) => {
      res.status(201).send({ comment: result[0] });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const articleBody = req.body;

  const checkArticleId = selectArticleById(articleId);
  const updateArticle = updateArticleById(articleId, articleBody);

  Promise.all([updateArticle, checkArticleId])
    .then((result) => {
      res.status(200).send({ article: result[0] });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;

  const checkCommentId = selectCommentById(commentId);
  const deleteComment = deleteCommentById(commentId);

  Promise.all([deleteComment, checkCommentId])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
