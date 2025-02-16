module.exports = {
  getIngredients: (req, res) => {
    return res.json({ status: 200, message: 'ingredients' });
  },
};
