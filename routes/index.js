const express = require('express');

const app = require('../server')
const {getStats, getStatus} = require('../controllers/AppController')


module.exports = (app) => {
app.get('/status', (req, res) => {
  res.status(200).send(getStatus(res));
})

app.get('/stats', (req, res) => {
  res.status(200).send(getStats(res));
})
}

