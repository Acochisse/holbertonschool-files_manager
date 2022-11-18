import redisClient from "../utils/redis";
import dbClient from "../utils/db";


module.exports = new class AppControler {
  async getStatus() {
    const data = JSON.stringify({
    'redis': redisClient.isAlive(),
    'db': dbClient.isAlive(),
  })
  console.log(data);
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

