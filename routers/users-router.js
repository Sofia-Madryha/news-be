const {
  getUsers,
  getUsersByUsername,
  postUser,
  patchUser,
} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter.route("/:username").get(getUsersByUsername).patch(patchUser);

module.exports = usersRouter;
