// Require packages
var jwt = require('jsonwebtoken');
var passport = require('passport');
var User = require('../models/user');
var secret = require('../config/config').secret;

function register(req, res, next) {
  // Local strategy ('local-register')
  var localStrategy = passport.authenticate('local-register', function (err, user, info) {
    if (err) return res.status(500).json({ message: 'Something went wrong!' });
    if (info) return res.status(401).json({ message: info.message });
    if (!user) return res.status(401).json({ message: 'A user already exists with this email!' });

    // create token
    var token = jwt.sign(user, secret, { expiresIn: 60*60*48 });

    // return token
    return res.status(200).json({
      success: true,
      message: "Thank you for authenticating",
      token: token,
      user: user
    });
  });

  // return strategy
  return localStrategy(req, res, next);
};

function login(req, res, next) {
  // Find user
  User.findOne({
    "local.email": req.body.email
  }, function (err, user) {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(403).json({ message: 'No user found.' });
    if (!user.validPassword(req.body.password)) return res.status(403).json({ message: 'Authentication failed.' });

    // create token
    var token = jwt.sign(user, secret, { expiresIn: 60*60*48 });

    // return
    return res.status(200).json({
      success: true,
      message: 'Welcome!',
      token: token,
      user: user
    });
  });
};

module.exports = {
  login: login,
  register: register
};
