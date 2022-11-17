const express = require('express');
const redisClient = require('./utils/redis');
const app = express();
const port = process.env.PORT || 5000;

const router = require('./routes/index');
const { Server } = require('mongodb/lib/core');

app.use(router);
app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}
);

modules.exports = app;
