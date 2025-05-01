const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article id is not found",
        });
      }
      return result.rows[0];
    });
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id)::int comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  let queryValues = [];

  const allowedSortingQueries = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const allowedOrderQueries = ["ASC", "DESC"];

  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (sort_by && allowedSortingQueries.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({ status: 404, msg: "Invalid query for sorting" });
  }

  if (order && allowedOrderQueries.includes(order.toUpperCase())) {
    queryStr += ` ${order}`;
  } else {
    return Promise.reject({ status: 404, msg: "Invalid query for order" });
  }

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows;
  });
};

exports.updateArticleById = (articleId, articleBody) => {
  const regex = /^-?\d+$/;

  const { inc_votes } = articleBody;

  const requiredKeys = ["inc_votes"];

  const missingKeys = requiredKeys.filter(
    (key) => !articleBody.hasOwnProperty(key)
  );

  if (missingKeys.length > 0) {
    return Promise.reject({
      status: 400,
      msg: `Missing key '${missingKeys[0]}'`,
    });
  }

  if (!regex.test(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "inc_votes should be a number",
    });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + ${inc_votes} WHERE article_id = $1 RETURNING *`,
      [articleId]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.insertArticle = (articleBody) => {
  const { author, title, body, topic } = articleBody;
  const article_img_url = articleBody.article_img_url || "";
  const requiredKeys = ["author", "title", "body", "topic"];

  const missingKeys = requiredKeys.filter(
    (key) => !articleBody.hasOwnProperty(key)
  );

  if (missingKeys.length > 0) {
    return Promise.reject({
      status: 400,
      msg: `Missing key '${missingKeys[0]}'`,
    });
  }

  return db
    .query(
      `INSERT INTO articles(author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *, 0 AS comment_count`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
