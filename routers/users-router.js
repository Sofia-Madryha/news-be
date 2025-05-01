const {
  getUsers,
  getUsersByUsername,
} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUsersByUsername);

module.exports = usersRouter;
