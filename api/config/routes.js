// Require packages
var express = require('express');
var passport = require('passport');

// Require controllers
var authController = require('../controllers/authController')
var eventController = require('../controllers/eventController');

// Establish 'router'
var router = express.Router();

// Authentication routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/github', authController.github);

// Front-end routes
router.get('/events', eventController.allEvents);
router.post('/events/new', eventController.newEvent);
router.post('/events/edit', eventController.editEvent);
router.post('/events/delete', eventController.deleteEvent);

module.exports = router;
