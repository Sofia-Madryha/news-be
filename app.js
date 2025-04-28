const express = require("express");

const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles } = require("./controllers/articles.controller");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles)

app.all('/*splat', (req, res) => {
  res.status(404).send({ msg: "Invalid url!" });
});


app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error !" });
});

module.exports = app;
