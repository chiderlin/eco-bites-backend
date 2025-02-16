const GCS = require('@server/module/gcs');
const fs = require('fs');
const path = require('path');
const config = require('@server/config');
const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore({
  projectId: config.GCP.PROJECT,
  keyFilename: config.GCP.KEY,
});

module.exports = {
  getPostByUserId: async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required.' });
    try {
      const postQuery = db
        .collection('posts')
        .where('user_id', '==', userId)
        .select(
          'user_id',
          'recipe_img',
          'type',
          'recipe',
          'review',
          'created_at'
        );
      const postSnap = await postQuery.get();
      if (postSnap.empty) {
        return res.json({ status: 'ok', data: { posts: [] } });
      } else {
        const posts = postSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log("User's Posts:", posts);
        return res.json({ status: 'ok', data: { posts } });
      }
    } catch (e) {
      console.error('getPost err: ', getPost);
      return res.status(500).json({ error: e.message });
    }
  },

  uploadPic: async (req, res) => {
    // console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ error: 'No image upload.' });
    }
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required.' });
    const { buffer, originalname, mimetype } = req.file;
    console.log('MIME Type:', mimetype);
    try {
      GCS.init({
        projectId: config.GCP.PROJECT,
        keyFilename: config.GCP.KEY,
        bucketname: config.GCP.BUCKETNAME,
      });
      const timestamp = Date.now();
      const url = await GCS.uploadFromBuffer(
        buffer,
        `fridge-pictures/${userId}_${timestamp}_${originalname}`
      );
      return res.json({ status: 'ok', data: { url } });
    } catch (e) {
      console.error('uploadPic err: ', e);
      return res.status(500).json({ error: e.message });
    }
  },

  getPostById: async (req, res) => {
    const { id } = req.params;
    try {
      const postQuery = await db.collection('posts').doc(id).get();
      if (postQuery.exists) {
        const { user_id, recipe, recipe_img, review, type, created_at } =
          postQuery.data();
        return res.json({
          status: 'ok',
          data: { user_id, recipe, recipe_img, review, type, created_at },
        });
      }
    } catch (e) {
      console.error('getPostById err: ', e);
      return res.status(500).json({ error: e.message });
    }
  },

  createPostByUserId: async (req, res) => {
    try {
      const { userId, recipe } = req.body;
      if (!userId || !recipe)
        return res.status(400).json({ error: 'userId and recipe required.' });
      const postRef = await db.collection('posts').add({
        user_id: userId,
        recipe_img: null,
        type: 'draft',
        recipe,
        review: null,
        created_at: Firestore.Timestamp.now(),
        updated_at: Firestore.Timestamp.now(),
        published_at: null,
        deleted_at: null,
      });
      return res.json({ status: 'ok', data: { postId: postRef.id } });
    } catch (e) {
      console.error('createPostByUserId err: ', e);
      return res.status(500).json({ error: e.message });
    }
  },

  // when saving posts
  updatePostById: async (req, res) => {
    const { id } = req.params;
    const { recipeImgUrl, type, review } = req.body;
    try {
      const postRef = db.collection('posts').doc(id);
      const updateData = {};
      if (recipeImgUrl) {
        updateData.recipe_img = recipeImgUrl;
      }
      if (type) {
        updateData.type = type;
      }
      if (review) {
        updateData.review = review;
      }
      if (type && type == 'published') {
        updateData.published_at = Firestore.Timestamp.now();
      }

      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = Firestore.Timestamp.now();
      }
      // console.log(updateData);
      await postRef.set(updateData, { merge: true });
      return res.json({ status: 'ok' });
    } catch (e) {
      console.error('updatePostByUserId err: ', e);
      return res.status(500).json({ error: e.message });
    }
  },
};
