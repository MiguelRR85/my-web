const mongoose = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');
require('dotenv').config()
const Comment = require('../models/comment.model');
const createError = require('http-errors');
const file = require('file-system');
const fs = require('fs');

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => res.json(users))
    .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  let id = req.params.id;
  User.findById(id)
    .then(user => res.json(user))
    .catch(error => next(error));
}

module.exports.update = (req, res, next) => {
  const user = new User(req.body);
  let userId = req.params.id;
  let lastPath;
  let lastImage;


  User.findById(userId)
    .then(user => {
      if(req.file){
        console.log("hay foto")
        fs.unlink(`${user.avatarPath}`);
      } 
      lastPath = user.avatarPath;
      lastImage = user.avatar;
    })
    .catch()
 
    if(req.file){
      user.avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      user.avatarPath = req.file.path;
    }else{
      user.avatar = lastImage;
      user.avatarPath = lastPath;
    }
    
  User.findByIdAndUpdate(userId, user)
    .then(user => {
      if (!user) {
        throw createError(404, 'User not found');
      } else {
        res.json(user);
      }
    })
    .catch(error => {
      next(error);
    });

}

module.exports.create = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        throw createError(409, `User with email ${req.body.email} already exists`);
      } else { 

        const user = new User(req.body);

        if(req.body.email === process.env.ADMIN_EMAIL){
          user.admin = true;
        }
        
        if(req.file){
          user.avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
          user.avatarPath = req.file.path;
        }
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
  // Promise.all([
  //   User.findByIdAndDelete(req.user.id),
  //   Comment.deleteMany({ user: mongoose.Types.ObjectId(req.params.userId)})
  // ])
  User.findById(req.params.id)
    .then((user)=>{
      if(user.admin !== true){
        User.findByIdAndDelete(req.params.id)
        .then((user) => {
          if (!user) {
            throw createError(404, 'User not found');
          } else {
            res.status(204).json();
          }
        })
        .catch(error => next(error));
      }else{
        throw createError(404, 'The administrator can not be deleted ');
      }
    })
    .catch(error => next(error))
  
  
    // .then(([user]) => {
    //   if (!user) {
    //     throw createError(404, 'User not found');
    //   } else {
    //     res.status(204).json();
    //   }
    // })
    // .catch(error => next(error));
}
