const { deleteComment,patchComment } = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").patch(patchComment).delete(deleteComment);

module.exports = commentsRouter;
