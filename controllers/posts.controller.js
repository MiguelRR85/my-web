const Post = require('../models/post.model');
const createError = require('http-errors');
const mongoose = require('mongoose');
var file = require('file-system');
var fs = require('fs');

module.exports.list = (req, res, next) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  let id = req.params.id;
  Post.findById(id)
    .then(post => res.json(post))
    .catch(error => next(error));
}

module.exports.create = (req, res, next) => {
  const post = new Post(req.body);
  console.log(post);
  if(req.user.admin === true){
    
    if(req.file){
      post.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      post.imagePath = req.file.path; 
    }

    post.nameUser = req.user.name;

    post.save()
      .then(post => res.status(201).json(post))
      .catch(error => next(error));
  }else{
    throw createError(404, "haven't privileges to create a post");
  }
  
}

module.exports.update = (req, res, next) => {
  const post = new Post(req.body);
  let postId = req.params.id;
  let lastPath;
  let lastImage;


  Post.findById(postId)
    .then(post => {
      if(req.file){
        console.log("hay foto")
        fs.unlink(`${post.imagePath}`);
      } 
      lastPath = post.imagePath;
      lastImage = post.image;
  })
    .catch()
 
    if(req.file){
      post.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      post.imagePath = req.file.path;
    }else{
      post.image = lastImage;
      post.imagePath = lastPath;
    }
    
  Post.findByIdAndUpdate(postId, post)
    .then(post => {
      if (!post) {
        throw createError(404, 'Work not found');
      } else {
        res.json(post);
      }
    })
    .catch(error => {
      next(error);
    });

}

module.exports.delete = (req, res, next) => {
  const id = req.params.id;

  Post.findByIdAndDelete(id)
    .then(post => {
      if (!post) {
        throw createError(404, 'Post not found');
      } else {
        res.status(204).json();
      }
    })
    .catch(error => next(error));
}
