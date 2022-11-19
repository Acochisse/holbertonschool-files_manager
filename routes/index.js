const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController')
const UsersController = require('../controllers/UsersController')
const AuthController = require('../controllers/AuthController')

router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

router.post('/users', UsersController.getUser);

router.post('/connect', AuthController.getConnect);

router.delete('/disconnect', AuthController.getDisconnect);

router.get('/files', AuthController.getFiles);



module.exports = router;
