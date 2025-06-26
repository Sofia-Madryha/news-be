const db = require("../db/connection");
const format = require("pg-format");

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

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};

exports.insertUser = (username, name, avatar_url) => {
  return db
    .query(
      `INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *;`,
      [username, name, avatar_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchUserByUsername = (username, name, avatar_url, liked_articles) => {
  const queries = [];

  if (name) {
    queries.push(format(`name = %L`, name));
  }

  if (avatar_url) {
    queries.push(format(`avatar_url = %L`, avatar_url));
  }

  if (liked_articles) {
    if (
      !Array.isArray(liked_articles) ||
      !liked_articles.every(Number.isInteger)
    ) {
      return Promise.reject({
        status: 400,
        msg: "liked_articles must be an array of integers",
      });
    }

    const pgArray = `{${liked_articles.join(",")}}`;
    queries.push(format(`liked_articles = %L`, pgArray));
  }

  const patchQuery = format(
    `UPDATE users SET %s WHERE username = %L RETURNING *;`,
    queries.join(", "),
    username
  );

  console.log(patchQuery);

  return db.query(patchQuery).then(({ rows }) => {
    return rows[0];
  });
};
