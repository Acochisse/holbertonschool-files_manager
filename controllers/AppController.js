import redisClient from "../utils/redis";
import dbClient from "../utils/db";


module.exports = new class AppControler {
  async getStatus(req, res) {
    const data = JSON.stringify({
    'redis': redisClient.isAlive(),
    'db': dbClient.isAlive(),
  })
  console.log(data);
  req.send(data);
  }

  async getStats(req, res) {
    const data = JSON.stringify({
    'users': dbClient.nbUsers(),
    'files': dbClient.nbFiles(),
  })
  req.send(data)
  }
}

