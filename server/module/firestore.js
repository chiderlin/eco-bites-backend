const { Firestore } = require('@google-cloud/firestore');
// const config = require('@server/config');
const config = require('../config/index');

const db = new Firestore({
  projectId: config.GCP.PROJECT,
  keyFilename: config.GCP.KEY,
});
console.log(db);

async function createUser(userId) {
  const userRef = db.collection('users').doc(userId);
  await userRef.set({
    email: 'test2@test.com',
    pwd: 'test2@test.com',
    created_at: Firestore.Timestamp.now(),
    updated_at: Firestore.Timestamp.now(),
    deleted_at: Firestore.Timestamp.now(),
  });
  console.log(`使用者${userId}以建立`);
}
createUser('user_123');

// class Firestore {
//   constructor() {}

//   create() {}

//   get() {}

//   update() {}

//   delete() {}
// }
