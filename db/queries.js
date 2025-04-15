const db = require("./connection");


function getAllUsers() {
    return db.query(`SELECT * FROM users;`).then((result) => console.log(result.rows)
  );
};

function getCodingArticles() {
    return db.query(`SELECT * FROM articles WHERE topic ='coding';`).then((result) => console.log(result.rows)
  );
}

function getBelowZeroVotesComments() {
    return db.query(`SELECT * FROM comments WHERE votes < 0;`).then((result) => console.log(result.rows)
  );
}

getAllUsers();
getCodingArticles();
getBelowZeroVotesComments();