const express = require('express');

app = require('server.js');


app.get('/status', (req, res) => { 
  res.send('OK');
});

app.get('/stats', (req, res) => {
  res.send('OK');
});

