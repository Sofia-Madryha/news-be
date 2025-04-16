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

function getAllTopics() {
    return db.query(`SELECT * FROM topics;`).then((result) => console.log(result.rows)
  );
};

function getArticlesByUser(user) {
    return db.query(`SELECT * FROM articles WHERE author='${user}';`).then((result) => console.log(result.rows)
  );
};

function getMoreThan10VotesComments() {
    return db.query(`SELECT * FROM comments WHERE votes > 10;`).then((result) => console.log(result.rows)
  );
}

// getAllUsers();
// getCodingArticles();
// getBelowZeroVotesComments();
// getAllTopics();
// getArticlesByUser('grumpy19');
getMoreThan10VotesComments();