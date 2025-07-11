const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRefArticles } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE topics (
        slug VARCHAR(2000) PRIMARY KEY, 
        description VARCHAR(4000), 
        img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
        username VARCHAR(500) PRIMARY KEY,
        name VARCHAR(500),
        avatar_url VARCHAR(1000),
        liked_articles INTEGER[] DEFAULT '{}')`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(500),
        topic VARCHAR(2000) REFERENCES topics(slug),
        author VARCHAR(500) REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000))`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR(500) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    })
    .then(() => {
      const formattedTopicData = topicData.map((item) => {
        return [item.slug, item.description, item.img_url];
      });

      const insertTopicData = format(
        `INSERT INTO topics(slug, description, img_url) 
        VALUES %L`,
        formattedTopicData
      );

      return db.query(insertTopicData);
    })
    .then(() => {
      const formattedUsersData = userData.map((item) => {
        return [
          item.username,
          item.name,
          item.avatar_url,
          item.likedArticles.length > 0
            ? `{${item.likedArticles.join(",")}}`
            : "{}",
        ];
      });

      const insertUsersData = format(
        `INSERT INTO users(username, name, avatar_url, liked_articles) 
        VALUES %L`,
        formattedUsersData
      );

      return db.query(insertUsersData);
    })
    .then(() => {
      const formattedArticlesData = articleData.map((article) => {
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          convertTimestampToDate({ created_at: article.created_at }).created_at,
          article.votes,
          article.article_img_url,
        ];
      });

      const insertArticlesData = format(
        `INSERT INTO articles(title, topic, author,body, created_at, votes, article_img_url ) 
        VALUES %L RETURNING *`,
        formattedArticlesData
      );

      return db.query(insertArticlesData);
    })
    .then((articlesInfo) => {
      const createdRefArticles = createRefArticles(articlesInfo.rows);

      const formattedCommentsData = commentData.map((comment) => {
        return [
          createdRefArticles[comment.article_title],
          comment.body,
          comment.votes,
          comment.author,
          convertTimestampToDate({ created_at: comment.created_at }).created_at,
        ];
      });

      const insertCommentsData = format(
        `INSERT INTO comments(article_id, body,votes, author, created_at)
        VALUES %L`,
        formattedCommentsData
      );

      return db.query(insertCommentsData);
    });
};
module.exports = seed;
