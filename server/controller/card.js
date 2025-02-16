const { Firestore } = require('@google-cloud/firestore');
const config = require('@server/config');

const db = new Firestore({
  projectId: config.GCP.PROJECT,
  keyFilename: config.GCP.KEY,
});

const cards = ['egg', 'flour', 'buttor', 'apple', 'vegetable', 'meat', 'rice'];
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
        console.log('genRandomNum', genRandomNum);
        const getRecipeCard = cards[genRandomNum];
        rewards.push(getRecipeCard);
      }

      // write into cards collection automatically
      await updateRewardAmount(userId, rewards);
      return res.json({ status: 'ok', data: rewards });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};

async function updateRewardAmount(userId, rewards) {
  const userRef = db.collection('users').doc(userId);
  const countObject = {};
  rewards.forEach((item) => {
    return (countObject[item] = (countObject[item] || 0) + 1);
  });
  console.log(countObject);
  await userRef.set(
    {
      recipe_cards_collecton: countObject,
      updated_at: Firestore.Timestamp.now(),
    },
    { merge: true }
  );
}
