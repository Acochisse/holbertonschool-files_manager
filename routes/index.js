const express = require('express');

const router = express.Router();
const {getStats, getStatus} = require('../controllers/AppController')

router.get('/status', (req, res) => {
  res.send(getStatus());
})

router.get('/stats', (req, res) => {
  res.send(getStats());
})

module.exports = router
