import redisClient from "../utils/redis";
import dbClient from "../utils/db";
import { json } from "express";
const SHA1 = require('sha1');

module.exports = new class UsersController {
  async getUser(req, res) {
    const email = req.body.email;
    if (!req.body.email) {
      res.status(400).send(json({error: 'Missing email'}));
    }
    if (!req.body.password) {
      res.status(400).send(json({error: 'Missing password'}));
    }
    const users = await dbClient.users;
    const uArray = await users.find({email}).toArray();
    if (uArray.length >= 1) {
      res.status(400).send(json({error: 'User already exists'}));
    }
    const pass = SHA1(req.body.password);
    const newUser = {email, password:pass};
    dbClient.users.insertOne(newUser);
    res.status(201).send(newUser);
    };
  };
