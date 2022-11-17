import redisClient from "../utils/redis";
import dbClient from "../utils/db";

class AppController {
  static getStatus(response) {
    const data = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    }
    return response.status(200).json(data);
  }

  static async getStats(response) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    return response.status(200).json(stats);
}
  }
module.exports = AppController;
