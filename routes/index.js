const express = require('express');

const app = require('../server')
const {getStats, getStatus} = require('../controllers/AppController')


module.exports = (app) => {
app.get('/status', (req, res) => {
  res.send(getStatus());
})

app.get('/stats', (req, res) => {
  res.send(getStats());
})
}

