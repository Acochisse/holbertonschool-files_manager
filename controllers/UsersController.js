import redisClient from "../utils/redis";
import dbClient from "../utils/db";
const SHA1 = require('sha1');

module.exports = new class UsersController {
  async getUser(req, res) {
    console.log(req.params);
    if (!req.params.email) {
      res.status(400).send(new Error('Missing email'));
    }
    if (!req.params.password) {
      res.status(400).send(new Error('Missing password'));
    }
    users = await dbClient.users;
    if (users.findOne(req.params.email)) {
      res.status(400).send(new Error('Already exist'));
    }
    const pass = hash(req.params.password);
    newUser = {email:req.params.email, password:pass};
    res.status(201).send(JSON.stringify(newUser))
    };
  };
