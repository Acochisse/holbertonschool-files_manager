import redisClient from '../utils/redis';
import dbClient from '../utils/db';

module.exports = new class AppController {
  async getStatus(req, res) {
    const data = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).send(data);
  }

  async getStats(req, res) {
    const data = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    res.status(200).send(data);
  }
}();
