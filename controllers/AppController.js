import redisClient from "../utils/redis";
import dbClient from "../utils/db";


module.exports = new class AppController {
  async getStatus(req, res) {
    const data = JSON.stringify({
    'redis': redisClient.isAlive(),
    'db': dbClient.isAlive(),
  })
  console.log(data);
  res.send(data);
  }

  async getStats(req, res) {
    const data = JSON.stringify({
    'users': await dbClient.nbUsers(),
    'files': await dbClient.nbFiles(),
  })
  res.send(data)
  }
}

