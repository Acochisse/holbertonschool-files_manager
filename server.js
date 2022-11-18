const express = require('express');
const redisClient = require('./utils/redis');
const app = express();
const port = process.env.PORT || 5000;

const router = require('./routes/index');
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}
);

module.exports = app;
