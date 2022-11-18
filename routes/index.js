const express = require('express');

const router = express.Router();
const {getStats, getStatus} = require('../controllers/AppController')
const { getUser } = require('../controllers/UsersController')
router.get('/status', getStatus);

router.get('/stats', getStats);

router.post('/users', getUser);

module.exports = router
