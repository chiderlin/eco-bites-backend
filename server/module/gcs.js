const { Storage } = require('@google-cloud/storage');
// const fs = require('fs');
// const path = require('path');
// const config = require('@server/config');
// const config = require('../config');
let _GCS;
let _bucket;
let _bucketname;

const init = ({ projectId, keyFilename, bucketname }) => {
  _GCS = new Storage({
    projectId,
    keyFilename,
  });
  _bucketname = bucketname;
  _bucket = _GCS.bucket(bucketname);
};

const uploadFromBuffer = (buffer, dest) =>
  new Promise((resolve, reject) => {
    if (!_bucketname || !_bucket) throw new Error('GCS not inital yet');
    const file = _bucket.file(dest);
    const ws = file.createWriteStream();
    ws.on('error', (err) => {
      reject(err);
    });
    ws.on('finish', async () => {
      resolve(await file.publicUrl());
    });
    ws.end(buffer);
  });

// const imageName = '6.jpeg';
// const promise = fs.promises.readFile(path.join(`./${imageName}`));

// Promise.resolve(promise).then(async (buffer) => {
//   // console.log(buffer);
//   init({
//     projectId: config.GCP.PROJECT,
//     keyFilename: config.GCP.KEY,
//     bucketname: config.GCP.BUCKETNAME,
//   });
//   const url = await uploadFromBuffer(buffer, `fridge-pictures/${imageName}`);
//   console.log(url);
// });

module.exports = { init, uploadFromBuffer };
