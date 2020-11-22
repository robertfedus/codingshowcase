const express = require('express');
const projectController = require('./../controllers/projectController');
const authorization = require('./authorization');
const router = express.Router();

router.get('/projects', projectController.getProjects);
router.post('/', authorization.protected, projectController.uploadProject);

module.exports = router;
