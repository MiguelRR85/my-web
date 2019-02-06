const Post = require('../models/post.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

module.exports.list = (req, res, next) => {
  Post.find({ user: mongoose.Types.ObjectId(req.params.userId) })
    .then(posts => res.json(posts))
    .catch(error => next(error));
}

module.exports.create = (req, res, next) => {
  const post = new Post(req.body);
  post.user = req.user.id;

  if (req.files) {
    post.images = [];
    for (const file of req.files) {
      post.images.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    }
  }

  post.save()
    .then(post => res.status(201).json(post))
    .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  Post.findById({ user: req.params.userId, _id: req.params.id })
    .populate('user')
    .populate({ path: 'comments', populate: { path: 'user' } })
    .then(post => {
      if (!post) {
        throw createError(404, 'Post not found');
      } else {
        res.json(post);
      }
    })
    .catch(error => {
      next(error);
    });
}

module.exports.delete = (req, res, next) => {
  Post.findOneAndDelete({ user: req.params.userId, _id: req.params.id })
    .then(post => {
      if (!post) {
        throw createError(404, 'Post not found');
      } else {
        res.status(204).json();
      }
    })
    .catch(error => next(error));
}
