const express = require('express');
const redisClient = require('./utils/redis');
const app = express();
const port = process.env.PORT || 5000;

const routePath = require('routes/index');
const { Server } = require('mongodb/lib/core');

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}
);

app.run = function() {
  app.get(routePath);
}

modules.exports = app;
