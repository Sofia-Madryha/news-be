const express = require("express");

const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");

const app = express();


app.get("/api", getApi);

app.get("/api/topics", getTopics)

app.all('/*splat', (req, res) => {
  res.status(404).send({ msg: "Invalid url!" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error !" });
});

module.exports = app;
