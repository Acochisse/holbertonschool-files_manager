import redisClient from "../utils/redis";
import dbClient from "../utils/db";
const express = require('express');
const app = require('../server')

const getStatus = (res) => {
  JSON.stringify({
  'redis': redisClient.isAlive(),
  'db': dbClient.isAlive(),
})
res.status(200).send(data);
}

const getStats = (res) => {
  JSON.stringify({
  'users': dbClient.nbUsers(),
  'files': dbClient.nbFiles(),
})
res.status(200).send(data);
}

module.exports = getStatus, getStats
