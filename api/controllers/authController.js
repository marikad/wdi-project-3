// Require packages
var jwt = require('jsonwebtoken');
var passport = require('passport');
var User = require('../models/user');
var secret = require('../config/config').secret;

function register(req, res, next) {
  // Local strategy ('local-register')

  // create token

  // return token

  // return strategy
};

function login(req, res, next) {
// Find user

// If no user then create one

// create token

// return
};

module.exports = {
  login: login,
  register: register
};
