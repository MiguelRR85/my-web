const express = require('express');
const router = express.Router();
const uploader = require('../config/multer.config');
const users = require('../controllers/users.controller');
const secure = require('../middleware/secure.middleware');
const user = require('../middleware/user.middleware');

router.get('/', users.list);
router.get('/:id', users.get);
router.post('/', uploader.single('avatar'), users.create);
router.post('/:id',uploader.single('avatar'), users.update);
router.delete('/:id', users.delete);

module.exports = router;