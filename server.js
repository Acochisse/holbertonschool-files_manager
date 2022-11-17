const express = require('express');
const redisClient = require('./utils/redis');
const app = express();
const port = process.env.PORT || 5000;

const index = require('./routes/index');

app.use(index);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}
);

modules.exports = app;
