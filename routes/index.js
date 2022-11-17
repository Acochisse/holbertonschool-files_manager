const express = require('express');

const app = require('../server')
const {getStats, getStatus} = require('../controllers/AppController')


module.exports = (app) => {
app.get('/status', (req, res) => {
  getStatus(res);
})

app.get('/stats', (req, res) => {
  getStats(res);
})
}

