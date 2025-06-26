const {
  selectUsers,
  selectUserByUsername,
  insertUser,
  patchUserByUsername,
} = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;
  return selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;

  if (
    typeof username !== "string" ||
    typeof name !== "string" ||
    typeof avatar_url !== "string" ||
    !username.trim() ||
    !name.trim()
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  return insertUser(username, name, avatar_url)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.patchUser = (req, res, next) => {
  const { username } = req.params;
  const { name, avatar_url, liked_articles } = req.body;

  if (
    Object.keys(req.body).length === 0 ||
    (name !== undefined && (typeof name !== "string" || !name.trim())) ||
    (avatar_url !== undefined &&
      (typeof avatar_url !== "string" || !avatar_url.trim())) ||
    (liked_articles !== undefined && !Array.isArray(liked_articles))
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  const checkUsername = selectUserByUsername(username);
  const updateUsername = patchUserByUsername(
    username,
    name,
    avatar_url,
    liked_articles
  );

  Promise.all([updateUsername, checkUsername])
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
