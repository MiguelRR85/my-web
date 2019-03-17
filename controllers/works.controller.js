const Work = require('../models/work.model');
const createError = require('http-errors');
const mongoose = require('mongoose');
const fs = require('fs-extra');

module.exports.list = (req, res, next) => {
  Work.find()
    .then(works => res.json(works))
    .catch(error => next(error));
}

module.exports.create = (req, res, next) => {
  const work = new Work(req.body);
  console.log("work--->Controll", work)
  console.log("work--->Controll1", req.file)
  if(req.file){
    work.img = `${req.protocol}://${req.get('host')}/uploads/works/${req.file.filename}`;
    work.imgPath = req.file.path;
  }

  work.save()
    .then(work => res.status(201).json(work))
    .catch(error => next(error));
}

module.exports.update = (req, res, next) => {
  const work = new Work(req.body);
  let workId = req.params.id;
  let lastPath;
  let lastImage;


  Work.findById(workId)
    .then(work => {
      if(req.file){
        console.log("hay foto")
        fs.unlink(`${work.imgPath}`);
      } 
      lastPath = work.imgPath;
      lastImage = work.img;
  })
    .catch()
 
    if(req.file){
      work.img = `${req.protocol}://${req.get('host')}/uploads/works/${req.file.filename}`;
      work.imgPath = req.file.path;
    }else{
      work.img = lastImage;
      work.imgPath = lastPath;
    }
    
  Work.findByIdAndUpdate(workId, work)
    .then(work => {
      if (!work) {
        throw createError(404, 'Work not found');
      } else {
        res.json(work);
      }
    })
    .catch(error => {
      next(error);
    });

}

module.exports.delete = (req, res, next) => {
  const id = req.params.id;

  Work.findByIdAndDelete(id)
    .then(work => {
      if (!work) {
        throw createError(404, 'Work not found');
      } else {
        res.status(204).json();
      }
    })
    .catch(error => next(error));
}
