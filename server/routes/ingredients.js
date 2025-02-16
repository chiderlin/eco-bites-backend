const express = require('express');
const router = express.Router();
const ingredients = require('@server/controller/ingredients');

router.get('/', ingredients.getIngredients);

module.exports = router;
