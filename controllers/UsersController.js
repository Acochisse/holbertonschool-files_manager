import redisClient from "../utils/redis";
import dbClient from "../utils/db";
import { json } from "express";
const crypto = require("crypto");


module.exports = new class UsersController {
  async getUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (!req.body.email) {
      res.status(400).json({error: 'Missing email'});
    }
    if (!req.body.password) {
      res.status(400).json({error: 'Missing password'});
    }
    const users = await dbClient.users;
    console.log(users);
    const user = await users.findOne({email});
    console.log(user)
    if (user) {
      res.status(400).json({error: 'Already exist'});
    }
    const hashed = crypto.createHash('SHA1').update(password).digest('hex');
    const userObj = await users.insertOne({ email, password: hashed });
    const newUser = { id: userObj.insertedId, email };
    res.status(201).json(newUser);
    };
  };
