import redisClient from "../utils/redis";
import dbClient from "../utils/db";
const SHA1 = require('sha1');

module.exports = new class UsersController {
  async getUser(req, res) {
    const email = req.body.email;
    if (!req.body.email) {
      res.status(400).send(new Error('Missing email'));
    }
    if (!req.body.password) {
      res.status(400).send(new Error('Missing password'));
    }
    const users = await dbClient.users;
    const uArray = await users.find({email}).toArray();
    if (uArray.length >= 1) {
      res.status(400).send(new Error('Already exist'));
    }
    const pass = SHA1(req.body.password);
    const newUser = {email:req.body.email, password:pass};
    res.status(201).send(newUser);
    };
  };
