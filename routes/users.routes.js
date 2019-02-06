const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller');
const secure = require('../middleware/secure.middleware');
const user = require('../middleware/user.middleware');

router.post('/', users.create);
router.get('/', secure.isAuthenticated, users.list);
router.get('/:id', secure.isAuthenticated, users.get)
router.delete('/:id', secure.isAuthenticated, user.isMe(), users.delete)

module.exports = router;