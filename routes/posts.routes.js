const express = require('express');
const router = express.Router({ mergeParams: true });
const uploader = require('../config/multer.config');
const posts = require('../controllers/posts.controller');



router.get('/', posts.list);
router.get('/:id', posts.get);
router.post('/', uploader.single('image'), posts.create);
router.post('/:id', uploader.single('image'), posts.update);
router.delete('/:id', posts.delete);

module.exports = router;