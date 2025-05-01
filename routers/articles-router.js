const {
  getArticles,
  getArticleById,
  patchArticle,
  postArticle
} = require("../controllers/articles.controller");
const {
  getCommentsByArticleId,
  postCommentForArticle,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentForArticle);

module.exports = articlesRouter;
