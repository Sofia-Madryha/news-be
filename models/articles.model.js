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
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [articleId])
    .then((result) => {
      return result.rows;
    });
};
