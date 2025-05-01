const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
} = require("../models/articles.model");
const { selectTopicBySlug } = require("../models/topics.model");
const { selectUserByUsername } = require("../models/users.model");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;

  return selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;

  const promiseArr = [];

  const fetchArticles = selectArticles(sort_by, order, topic, limit, p);
  promiseArr.push(fetchArticles);

  if (topic) {
    const checkTopic = selectTopicBySlug(topic);
    promiseArr.push(checkTopic);
  }

  Promise.all(promiseArr)
    .then((result) => {
      res.status(200).send({ articles: result[0] });
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

exports.postArticle = (req, res, next) => {
  const articleBody = req.body;
  const { author } = articleBody;
  const { topic } = articleBody;

  const checkAuthor = selectUserByUsername(author);
  const checkTopic = selectTopicBySlug(topic);
  const createArticle = insertArticle(articleBody);

  Promise.all([createArticle, checkAuthor, checkTopic])
    .then((result) => {
      res.status(201).send({ article: result[0] });
    })
    .catch(next);
};
