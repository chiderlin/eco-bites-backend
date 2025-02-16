// const firestore = require('@server/module/firestore');
const { Firestore } = require('@google-cloud/firestore');
const config = require('@server/config');
const db = new Firestore({
  projectId: config.GCP.PROJECT,
  keyFilename: config.GCP.KEY,
});

module.exports = {
  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('getUser id: ', id);
      const usersQuery = await db.collection('users').doc(id).get();
      if (usersQuery.exists) {
        const {
          email,
          username,
          ingredient_cards_collection,
          recipe_cards_collecton,
          created_at,
        } = usersQuery.data();
        return res.json({
          status: 'ok',
          data: {
            email,
            username,
            ingredient_cards_collection,
            recipe_cards_collecton,
            created_at,
          },
        });
      }
    } catch (e) {
      console.log('getUser err: ', e);
      return res.status(500).json({ error: e.message });
    }
  },
  createUser: async (req, res) => {
    try {
      const { email, username, pwd } = req.body;
      console.log('email', email);
      const userRef = await db.collection('users').add({
        email,
        username,
        pwd,
        ingredient_cards_collection: {},
        recipe_cards_collecton: {},
        created_at: Firestore.Timestamp.now(),
        updated_at: Firestore.Timestamp.now(),
      });
      // console.log('userRef', userRef);
      return res.json({ status: 'ok', data: { userId: userRef.id } });
    } catch (e) {
      console.log('createUser err: ', createUser);
      return res.status(500).json({ error: e.message });
    }
  },
};
