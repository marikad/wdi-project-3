// Require packages
var express = require('express');
var passport = require("passport");

// Establish 'router'
var router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
