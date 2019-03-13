const express = require('express');
const router = express.Router();
const works = require('../controllers/works.controller');
const uploader = require('../config/multer.config');


router.get('/', works.list);
router.post('/', uploader.single('image'), works.create);
router.post('/:id',uploader.single('image'), works.update)
router.delete('/:id', works.delete)

module.exports = router;