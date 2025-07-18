const express = require("express");
const cors = require("cors");

const apiRouter = require("./routers/api-router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "Invalid url!" });
});

app.use((err, req, res, next) => {
  if (err.code === "23505" || err.code === "23502") {
    if (err.constraint === "users_pkey") {
      res.status(409).send({ msg: "username already exists!" });
    }
  }
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
