// Require packages
var express = require('express');
var passport = require('passport');

// Require controllers
var authController = require('../controllers/authController')
// var eventfulController = require('../controllers/eventfulController');

// Establish 'router'
var router = express.Router();

// Authentication routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }), authController.gitRegister);
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), authController.gitCallback);

// Seed routes
// router.get('/seed-hackathon', eventfulController.hackathon);

module.exports = router;
