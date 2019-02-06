const mongoose = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const createError = require('http-errors');

module.exports.list = (req, res, next) => {
  User.find()
    .populate({ path: 'posts', select: 'id' })
    .then(users => res.json(users))
    .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  User.findById(req.params.id)
    .populate('posts')
    .then(user => res.json(user))
    .catch(error => next(error));
}

module.exports.create = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        throw createError(409, `User with email ${req.body.email} already exists`);
      } else {
        user = new User(req.body);
        user.save()
          .then(user => res.status(201).json(user))
          .catch(error => {
            next(error)
          });
      }
    })
    .catch(error => next(error));
}

module.exports.delete = (req, res, next) => {
  Promise.all([
    User.findByIdAndDelete(req.user.id),
    Post.deleteMany({ user: mongoose.Types.ObjectId(req.params.userId)}),
    Comment.deleteMany({ user: mongoose.Types.ObjectId(req.params.userId)})])
    .then(([user]) => {
      if (!user) {
        throw createError(404, 'User not found');
      } else {
        res.status(204).json();
      }
    })
    .catch(error => next(error));
}
