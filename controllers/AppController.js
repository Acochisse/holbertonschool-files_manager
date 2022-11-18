import redisClient from "../utils/redis";
import dbClient from "../utils/db";


new class AppController {
  async getStatus() {
    const data = JSON.stringify({
    'redis': redisClient.isAlive(),
    'db': dbClient.isAlive(),
  })
  return data;
  }

  async getStats() {
    const data = JSON.stringify({
    'users': dbClient.nbUsers(),
    'files': dbClient.nbFiles(),
  })
  return data;
  }
}
module.exports = AppController
