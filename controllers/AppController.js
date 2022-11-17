import redisClient from "../utils/redis";
import dbClient from "../utils/db";
const express = require('express');
const app = require('../server')

const getStatus = () => {
  const data = JSON.stringify({
  'redis': redisClient.isAlive(),
  'db': dbClient.isAlive(),
})
return data;
}

const getStats = () => {
  const data = JSON.stringify({
  'users': dbClient.nbUsers(),
  'files': dbClient.nbFiles(),
})
return data;
}

module.exports = getStatus, getStats
