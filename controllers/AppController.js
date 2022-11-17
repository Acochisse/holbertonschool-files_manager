const app = require('server.js');
const routePath = require('.routes/index.js');
const redisClient = require('./utils/redis');
const mongoClient = require('./utils/db');

app.get('/status'
)