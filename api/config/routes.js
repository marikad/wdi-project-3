// Require packages
var express = require('express');
var passport = require("passport");

// Establish 'router'
var router = express.Router();

var authController = require('../controllers/authController');
var eventfulController = require('../controllers/eventfulController');

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/seed-hackathon', eventfulController.hackathon);

module.exports = router;
