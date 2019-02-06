const express = require('express');
const router = express.Router({ mergeParams: true });
const comments = require('../controllers/comments.controller');
const secure = require('../middleware/secure.middleware');

router.post('/', secure.isAuthenticated, comments.create);
router.delete('/:id', secure.isAuthenticated, comments.delete);

module.exports = router;