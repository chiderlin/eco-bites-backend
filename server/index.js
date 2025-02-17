require('module-alias/register');
const express = require('express');
const cors = require('cors');
const router = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const allowerOrigins = [
  'https://vivi2393142.github.io/*',
  'http://localhost:3000',
  '*',
];

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin || allowerOrigins.includes(origin)) {
        cb(null, true); // allow request
      } else {
        cb(new Error('Not allowed by CORS')); // block
      }
    },
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router);

app.listen(PORT, () =>
  console.log('\x1b[37m\x1b[44m%s\x1b[0m', `Listening on ${HOST}, port ${PORT}`)
);
