const {
  selectArticleById,
  selectArticles,
  updateArticleById,
} = require("../models/articles.model");
const { selectTopicBySlug } = require("../models/topics.model");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;

  return selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  const promiseArr = [];

  const fetchArticles = selectArticles(sort_by, order, topic);
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
