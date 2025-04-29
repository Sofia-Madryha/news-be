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

exports.selectArticles = () => {
  return db
    .query(
      `SELECT 
    articles.article_id, articles.title, articles.topic, articles.author, articles.created_at,  articles.votes, articles.article_img_url,
    COUNT(comments.comment_id)::int comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [articleId]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertCommentForArticle = (articleId, commentBody) => {
  const { username, body } = commentBody;
  const requiredKeys = ["username", "body"];

  const missingKeys = requiredKeys.filter(
    (key) => !commentBody.hasOwnProperty(key)
  );

  if (missingKeys.length > 0) {
    return Promise.reject({
      status: 400,
      msg: `Missing key '${missingKeys[0]}'`,
    });
  }

  return db
    .query(
      `INSERT INTO comments(article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [articleId, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "user is not found",
        });
      }
      return result.rows[0];
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

exports.selectCommentById = (commentId) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment id is not found",
        });
      }
      return result.rows[0];
    });
};

exports.deleteCommentById = (commentId) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
};
