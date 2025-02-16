const express = require('express');
const router = express.Router();
const users = require('@server/controller/users');

router.get('/:id', users.getUser);
router.post('/', users.createUser);

module.exports = router;
