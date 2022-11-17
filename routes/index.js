const express = require('express');

const app = require('../server.js');

module.exports = function(index) {
const status = app.get('/status', (req, res) => { 
  AppController.getStatus
});

const stats = app.get('/stats', (req, res) => {
  res.send('OK');
});
return status, stats;
}

module.exports = index;
