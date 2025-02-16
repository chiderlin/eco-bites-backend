const express = require('express');
const router = express.Router();
const posts = require('@server/controller/posts');
const multer = require('multer');

// setting store buffter
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', posts.getPostByUserId);
router.post('/', posts.createPostByUserId);
router.get('/:id', posts.getPostById);
router.patch('/:id', posts.updatePostById);
router.post('/upload-image', upload.single('image'), posts.uploadPic);

module.exports = router;
