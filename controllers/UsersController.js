import redisClient from "../utils/redis";
import dbClient from "../utils/db";
import { json } from "express";
const crypto = require("crypto");
const mongo = require('mongodb');


module.exports = new class UsersController {
  async getUser(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });
    const users = await dbClient.users;
    const user = await users.findOne({email});
    if (user) {
      res.status(400).json({error: 'Already exist'});
    }
    const hashed = crypto.createHash('SHA1').update(password).digest('hex');
    const userObj = await users.insertOne({ email, password: hashed });
    const newUser = { id: userObj.insertedId, email };
    res.status(201).json(newUser);
    };

    async getMe(req, res) {
      const token = req.headers['x-token'];
      const user = await redisClient.get(`auth_${token}`);
      const uID = new mongo.ObjectID(user);

      if (!user) {
        return res.status(401).json({error: 'Unauthorized'});
      }
      const dbUser = await dbClient.collection('users').findOne({ _id: uID})
      return res.status(200).json({id: dbUser.id, email: dbUser.email});
    }
  };
