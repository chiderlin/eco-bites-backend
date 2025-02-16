const express = require('express');
const router = express.Router();
const hello = require('@server/controller/hello');
const card = require('@server/controller/card');

router.get('/', hello);
router.get('/rewards', card.getRandomReward);

router.use('/users', require('./users'));
router.use('/recipes', require('./recipes'));
router.use('/posts', require('./posts'));
// router.use('/ingredients', require('./ingredients'));

router.use((err, req, res, next) => {
  console.error('💥 Router Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;
