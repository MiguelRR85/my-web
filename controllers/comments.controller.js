const Comment = require('../models/comment.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

module.exports.create = (req, res, next) => {
  const comment = new Comment(req.body);
  comment.user = req.user.id;
  comment.post = req.params.postId;

  comment.save()
    .then(comment => res.status(201).json(comment))
    .catch(error => next(error));
}

module.exports.delete = (req, res, next) => {
  Comment.findOneAndDelete({ user: req.user.id, _id: req.params.id })
    .then(comment => {
      if (!comment) {
        throw createError(404, 'Comment not found');
      } else {
        res.status(204).json();
      }
    })
    .catch(error => next(error));
}
