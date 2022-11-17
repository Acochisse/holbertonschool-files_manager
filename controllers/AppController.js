const app = require('../server.js');
const routePath = require('.routes/index.js');
const redisClient = require('./utils/redis');
const mongoClient = require('./utils/db');

app.get('/status', (req, res) => { {
    res.status(200).send(JSON.stringify({ "redis": redisClient.isAlive(), "db": mongoClient.isAlive() }));
  }
});

app.get('/stats', (req, res) => {
  res.status(200).send(JSON.stringify({ "users": db.dbClient.nbUsers(), "files": db.dbClient.nbFiles() }));
});

