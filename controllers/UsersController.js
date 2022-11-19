import redisClient from "../utils/redis";
import dbClient from "../utils/db";
import { json } from "express";
const SHA1 = require('sha1');

module.exports = new class UsersController {
  async getUser(req, res) {
    const email = req.body.email;
    if (!req.body.email) {
      res.status(400).json({error: 'Missing email'});
    }
    if (!req.body.password) {
      res.status(400).json({error: 'Missing password'});
    }
    const users = await dbClient.users;
    const user = await users.findOne({email});
    if (!user) {
      res.status(400).json({error: 'User already exists'});
    }
    const pass = SHA1(req.body.password);
    const newUser = {email, password:pass};
    await dbClient.users.insertOne(newUser);
    return res.status(201).json({ id: newUser.insertedId, email });
    };
  };
