const express = require('express');
const router = express.Router({ mergeParams: true });
const comments = require('../controllers/comments.controller');
const secure = require('../middleware/secure.middleware');

router.post('/post/:postId',secure.isAuthenticated, comments.create);
router.get('/post/:postId', comments.list);
router.delete('/:id', comments.delete);

module.exports = router;