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
    var userJwt = {
      user_id: user._id
    };

    var token = jwt.sign(userJwt, secret, { expiresIn: 60*60*48 });

    // return token
    return res.status(200).json({
      success: true,
      message: "Thank you for authenticating",
      token: token,
      user: userJwt
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
    var userJwt = {
      user_id: user._id
    };
    var token = jwt.sign(userJwt, secret, { expiresIn: 60*60*48 });

    // return
    return res.status(200).json({
      success: true,
      message: 'Welcome!',
      token: token,
      user: userJwt
    });
  });
};

function gitRegister(req, res) {
  // The request will be redirected to GitHub for authentication, so this
  // function will not be called.
};

function gitCallback(req, res) {
  // Successful authentication, redirect home.
  console.log('sucessful gitHub login')
  res.status(200).json({
    success: true,
    message: 'Welcome via GutHub!'
  });
};

function github(req, res, next){
  var profile = req.body
  console.log(profile);

  var access_token = profile.access_token
  if (!access_token) return res.status(500).json({ message: 'No Access Token provided.' });

  profile.emails.forEach(function(index, email) {
    if (email.primary === 'true') profile.email = email.email
  })

  if (profile.email) {
    User.findOne({ 
      'local.email' : profile.email 
    }, function(err, user) {
      if (err) return res.status(500).json({ message: 'Something went wrong.' });

      // Update existing user
      if (user) {
        user.github.id           = profile.id;
        user.github.access_token = profile.access_token;

        return user.save(function(err, user) {
          if (err || !user) return res.status(500).json({ message: 'Something went wrong.' });

          var userJwt = {
            user_id: user._id
          };
          var token = jwt.sign(userJwt, secret, { expiresIn: 60*60*48 });
          return res.status(200).json({
            success: true,
            message: 'Welcome!',
            token: token,
            user: userJwt
          });
        });
      }

      // Create new user
      var newUser                 = new User();
      newUser.github.id           = profile.id;
      newUser.github.access_token = profile.access_token;

      newUser.local.city      = profile.location;
      newUser.local.email     = profile.email;

      // Giving a password for mandatory field -> It will not be used.
      newUser.local.password  = profile.access_token;

      return newUser.save(function(err, user) {
        console.log(err)
        if (err) return res.status(500).json({ message: 'Something went wrong.' });
        var userJwt = {
          user_id: user._id
        };
        var token = jwt.sign(userJwt, secret, { expiresIn: 60*60*48 });
        return res.status(200).json({
          success: true,
          message: 'Welcome!',
          token: token,
          user: userJwt
        });
      });
    });

  } else {
    // Github can't find an email
    User.findOneAndUpdate({ 
      'github.id' : profile.id
    }, {
      'github.access_token' : profile.access_token
    }, function(err, user) {
      if (err) return res.status(500).json({ message: 'Something went wrong. ', err });

      // Return existing user
      if (user) return returnJWT(req, res, user);

      // Create new user
      var newUser                 = new User();
      newUser.github.id           = profile.id;
      newUser.github.access_token = profile.access_token;

      newUser.local.fullname  = profile.name;
      newUser.local.username  = profile.name;
      newUser.local.image     = profile.picture;

      // Giving an email & password for mandatory field -> It will not be used.
      newUser.local.email          = "temp-"+profile.access_token+"@github.com"
      newUser.local.password       = profile.access_token;

      return newUser.save(function(err, user) {
        if (err) return res.status(500).json({ message: 'Something went wrong.' });
        return returnJWT(req, res, user);
      });
    });
  }
}

module.exports = {
  login: login,
  register: register,
  gitRegister: gitRegister,
  gitCallback: gitCallback,
  github: github
};
