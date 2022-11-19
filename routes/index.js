const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController')
const { getUser } = require('../controllers/UsersController')

router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

router.all('/users', getUser);

module.exports = router;
