const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  insertCommentForArticle,
  selectCommentById,
  deleteCommentById,
} = require("../models/comments.model");
const { selectUserByUsername } = require("../models/users.model");

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
