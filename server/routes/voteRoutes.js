const express = require('express');
const voteController = require('./../controllers/voteController');
const authorization = require('./authorization');
const router = express.Router();

router.post('/', authorization.protected, voteController.vote);

module.exports = router;
