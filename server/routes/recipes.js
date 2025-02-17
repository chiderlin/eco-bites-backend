const express = require('express');
const router = express.Router();
const recipes = require('@server/controller/recipes');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', recipes.getRecipes);
router.get('/fridge/url', recipes.getFridgeRecipesUrl);
router.get('/fridge', upload.single('image'), recipes.getFridgeRecipes);
router.get('/random/suggestion', recipes.getRandomRecipes);
module.exports = router;
