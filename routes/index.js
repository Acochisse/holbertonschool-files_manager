const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController')
const UsersController = require('../controllers/UsersController')

router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

router.all('/users', UsersController.getUser);

module.exports = router;
