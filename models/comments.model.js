const db = require("../db/connection");

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

exports.patchCommentById = (commentId, commentBody) => {
  const regex = /^-?\d+$/;

  const { inc_votes } = commentBody;

  const requiredKeys = ["inc_votes"];

  const missingKeys = requiredKeys.filter(
    (key) => !commentBody.hasOwnProperty(key)
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
      `UPDATE comments SET votes = votes + ${inc_votes} WHERE comment_id = $1 RETURNING *`,
      [commentId]
    )
    .then((result) => {
      return result.rows[0];
    });
};