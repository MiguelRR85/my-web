const express = require('express');
const router = express.Router({ mergeParams: true });
const uploader = require('../config/multer.config');
const posts = require('../controllers/posts.controller');
const secure = require('../middleware/secure.middleware');
const user = require('../middleware/user.middleware');

router.get('/', secure.isAuthenticated, posts.list);
router.post('/', secure.isAuthenticated, user.isMe('userId'), uploader.array('images'), posts.create);
router.get('/:id', secure.isAuthenticated, posts.get);
router.delete('/:id', secure.isAuthenticated, user.isMe('userId'), posts.delete);

module.exports = router;