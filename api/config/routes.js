// Require packages
var express = require('express');
var passport = require('passport');

// Require controllers
var authController = require('../controllers/authController')

// Establish 'router'
var router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
