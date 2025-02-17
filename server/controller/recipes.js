const Gemini = require('@server/module/gemini');
const config = require('@server/config');

module.exports = {
  getRecipes: async (req, res) => {
    return res.json({ message: 'getRecipes' });
  },

  getFridgeRecipes: async (req, res) => {
    console.log('getFridgeRecipes req:', req);
    if (!req.file) {
      return res.status(400).json({ error: 'No image upload.' });
    }
    const { buffer, originalname, mimetype } = req.file;
    const base64Image = buffer.toString('base64');
    console.log('base64Image:', base64Image);
    const { amount = 3 } = req.body;
    console.log('MIME Type:', mimetype);

    const fridgePrompts = `What ingredients do I have in my fridge? 
    Based on these ingredients, please recommend a few recipes that allow me to fully utilize them. 
    If the recommended ${amount} recipes require additional ingredients, please list them as suggested purchases. 
    Please follow this format in your response: 
    
    [
      {
        recipe: <str>,
        required_ingredients: [<str>,<str>],
        instructions:[<str>,<str>],
        addtional_ingredients_to_purchase: [<str>,<str>],
        suggestion_time: <str> (unit:mins but only show number),
        difficulty: <str> (easy, medium, hard),
      },
      {
        recipe: <str>,
        required_ingredients: [<str>,<str>],
        instructions:[<str>,<str>],
        addtional_ingredients_to_purchase: [<str>,<str>],
        suggestion_time: <str> (unit:mins but only show number),
        difficulty: <str> (easy, medium, hard),
    },
      {
        recipe: <str>,
        required_ingredients: [<str>,<str>],
        instructions:[<str>,<str>],
        addtional_ingredients_to_purchase: [<str>,<str>],
       suggestion_time: <str> (unit:mins but only show number),
       difficulty: <str> (easy, medium, hard),
      },
    ]
    `;
    try {
      const ai = new Gemini(
        config.GCP.PROJECT,
        config.GCP.DEFAULT_LOCATION,
        config.GCP.DEFAULT_GEMINI_MODEL
      );
      const geminiResponse = await ai.base64ImgGenerateContent(
        base64Image,
        fridgePrompts
      );
      console.log('geminiResponse: ', geminiResponse);
      const text = geminiResponse.candidates?.[0]?.content?.parts?.[0].text;
      console.log('text:', text);
      return res.json({ status: 'ok', data: text });
    } catch (e) {
      console.log('getFridgeRecipes err:', e);
      return res.status(500).json({ error: e.message });
    }
  },
  getFridgeRecipesUrl: async (req, res) => {
    const { url, amount = 3 } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'No image upload.' });
    }
    const fridgePrompts = `What ingredients do I have in my fridge? 
    Based on these ingredients, please recommend a few recipes that allow me to fully utilize them. 
    If the recommended ${amount} recipes require additional ingredients, please list them as suggested purchases. 
    Please follow this format in your response: 
    
    [
      {
        recipe: <str>,
        required_ingredients: [<str>,<str>],
        instructions:[<str>,<str>],
        addtional_ingredients_to_purchase: [<str>,<str>],
        suggestion_time: <str> (unit:mins but only show number),
        difficulty: <str> (easy, medium, hard),
      },
      {
        recipe: <str>,
        required_ingredients: [<str>,<str>],
        instructions:[<str>,<str>],
        addtional_ingredients_to_purchase: [<str>,<str>],
        suggestion_time: <str> (unit:mins but only show number),
        difficulty: <str> (easy, medium, hard),
    },
      {
        recipe: <str>,
        required_ingredients: [<str>,<str>],
        instructions:[<str>,<str>],
        addtional_ingredients_to_purchase: [<str>,<str>],
       suggestion_time: <str> (unit:mins but only show number),
       difficulty: <str> (easy, medium, hard),
      },
    ]
    `;
    try {
      const ai = new Gemini(
        config.GCP.PROJECT,
        config.GCP.DEFAULT_LOCATION,
        config.GCP.DEFAULT_GEMINI_MODEL
      );
      const geminiResponse = await ai.imgUrlGenerateContent(url, fridgePrompts);
      // console.log(geminiResponse);
      const text = geminiResponse.candidates?.[0]?.content?.parts?.[0].text;
      console.log('text:', text);
      return res.json({ status: 'ok', data: text });
    } catch (e) {
      console.log('getFridgeRecipes err:', e);
      return res.status(500).json({ error: e.message });
    }
  },

  getRandomRecipes: async (req, res) => {
    const { amount = 3 } = req.query;
    const recommandRecipePrompts = `Recommended ${amount} recipes require additional ingredients, please list them as suggested purchases. 
Please follow this format in your response: 

----
[
  {
    recipe: <str>,
    required_ingredients: [<str>,<str>],
    instructions:[<str>,<str>],
    suggestion_time: <str> (unit:mins but only show number),
    difficulty: <str> (easy, medium, hard),
  },
  {
    recipe: <str>,
    required_ingredients: [<str>,<str>],
    instructions:[<str>,<str>],
    suggestion_time: <str> (unit:mins but only show number),
    difficulty: <str> (easy, medium, hard),
  },
  {
    recipe: <str>,
    required_ingredients: [<str>,<str>],
    instructions:[<str>,<str>],
   suggestion_time: <str> (unit:mins but only show number),
   difficulty: <str> (easy, medium, hard),
  },
]
`;
    try {
      const ai = new Gemini(
        config.GCP.PROJECT,
        config.GCP.DEFAULT_LOCATION,
        config.GCP.DEFAULT_GEMINI_MODEL,
        'you are a ai assistant to recommand recipes'
      );
      const geminiResponse = await ai.generateContent(recommandRecipePrompts);
      const text = geminiResponse.candidates?.[0]?.content?.parts?.[0].text;
      console.log(text);
      return res.json({ status: 'ok', data: text });
    } catch (e) {
      console.log('getRecipes err:', e);
      return res.status(500).json({ error: e.message });
    }
  },
};
