module.exports = {
  GCP: {
    KEY: './server/config/key.json',
    // KEY: '../config/key.json',
    PROJECT: 'astute-anchor-300903',
    BUCKETNAME: 'eco-bites',
    DEFAULT_GEMINI_INSTRUCTION:
      'you are a ai assistant to recommand recipe base on fridge picture user sent to you',
    DEFAULT_LOCATION: 'europe-west2', // london
    DEFAULT_GEMINI_MODEL: 'gemini-1.5-flash-002',
    UPGRADE_LOCATION: 'us-central1',
    UPGRADE_GEMINI_MODEL: 'gemini-2.0-flash-001',
  },
};
