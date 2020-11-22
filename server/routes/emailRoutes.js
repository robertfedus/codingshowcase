const express = require('express');
const emailController = require('./../controllers/emailController');
const authorization = require('./authorization');
const router = express.Router();

router.post('/', authorization.protected, emailController.sendFeedback);

module.exports = router;
