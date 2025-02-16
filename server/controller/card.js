const { Firestore } = require('@google-cloud/firestore');
const config = require('@server/config');

const db = new Firestore({
  projectId: config.GCP.PROJECT,
  keyFilename: config.GCP.KEY,
});

const cards = ['egg', 'flour', 'butter', 'apple', 'vegetable', 'meat', 'rice'];
module.exports = {
  getRandomReward: async (req, res) => {
    try {
      const { userId, amount } = req.query;
      if (!userId) return res.status(400).json({ error: 'userId required.' });
      if (!amount) return res.status(400).json({ error: 'amount required.' });
      const rewards = [];
      const amountInt = parseInt(amount);
      for (let i = 0; i < amountInt; i++) {
        const genRandomNum = Math.floor(Math.random() * cards.length);
        // console.log('genRandomNum', genRandomNum);
        const getRecipeCard = cards[genRandomNum];
        rewards.push(getRecipeCard);
      }

      // write into cards collection automatically
      await updateRewardAmount(userId, rewards);
      return res.json({ status: 'ok', data: rewards });
    } catch (e) {
      console.error('getRandomReward err: ', e);
      return res.status(500).json({ error: e.message });
    }
  },
  reduceRewardCard: async (req, res) => {
    const { userId, items } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (typeof items !== 'object') {
      return res.status(400).json({ error: 'items object required.' });
    }
    try {
      const userRef = db.collection('users').doc(userId);
      const userData = (await userRef.get()).data();
      const recipeCardsCollecton = userData.recipe_cards_collecton;
      Object.keys(items).forEach((item) => {
        if (recipeCardsCollecton[item]) {
          recipeCardsCollecton[item] = Math.max(
            0,
            recipeCardsCollecton[item] - items[item]
          ); // Prevent negative values
        }
      });
      await userRef.set(
        {
          recipe_cards_collecton: recipeCardsCollecton,
          updated_at: Firestore.Timestamp.now(),
        },
        { merge: true }
      );
      return res.json({ status: 'ok', data: recipeCardsCollecton });
    } catch (e) {
      console.error('reduceRewardCard err: ', e);
      return res.status(500).json({ error: e.message });
    }
  },
  addIngredientsCard: async (req, res) => {
    const { userId, items } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required.' });
    if (typeof items !== 'object') {
      return res.status(400).json({ error: 'item object required.' });
    }
    try {
      const userRef = db.collection('users').doc(userId);
      const userData = (await userRef.get()).data();
      const ingredientCardsCollection = userData.ingredient_cards_collection;
      // console.log('before: ', ingredientCardsCollection);
      Object.keys(items).forEach((item) => {
        if (ingredientCardsCollection[item]) {
          ingredientCardsCollection[item] =
            ingredientCardsCollection[item] + items[item];
        } else {
          ingredientCardsCollection[item] = items[item];
        }
        return ingredientCardsCollection[item];
      });
      // console.log('after: ', ingredientCardsCollection);

      await userRef.set(
        {
          ingredient_cards_collection: ingredientCardsCollection,
          updated_at: Firestore.Timestamp.now(),
        },
        { merge: true }
      );
      return res.json({ status: 'ok', data: ingredientCardsCollection });
    } catch (e) {
      console.error('addIngredientsCard err', e);
      return res.status(500).json({ error: e.message });
    }
  },
};

async function updateRewardAmount(userId, rewards) {
  const userRef = db.collection('users').doc(userId);
  const userData = (await userRef.get()).data();
  const recipesCardCollection = userData.recipe_cards_collecton;
  // console.log('before:', recipesCardCollection);
  // const countObject = {};
  rewards.forEach((item) => {
    return (recipesCardCollection[item] =
      (recipesCardCollection[item] || 0) + 1);
  });
  // console.log('after', recipesCardCollection);
  await userRef.set(
    {
      recipe_cards_collecton: recipesCardCollection,
      updated_at: Firestore.Timestamp.now(),
    },
    { merge: true }
  );
}
