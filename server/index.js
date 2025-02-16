require('module-alias/register');
const express = require('express');
const cors = require('cors');
const router = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// app.use(express.raw({ type: 'application/octet-stream' })); //處理2進制請求
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router);

app.listen(PORT, () =>
  console.log('\x1b[37m\x1b[44m%s\x1b[0m', `Listening on ${HOST}, port ${PORT}`)
);
