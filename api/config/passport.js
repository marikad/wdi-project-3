var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {
  passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, function (req, email, password, done) {
    // Find a user with supplied email
    User.findOne({'local.email' : email}, function (err, user) {
      if (err) return done(err, false, {message: 'Something went wrong. Please try again in a few minutes.'});
      if (user) return done(null, false, {message: 'This Email is already registered with HackJammer. Please login or use a new email address.'});

      // If no existing user, create the account
      var newUser = new User();
      newUser.local.email = email;
      newUser.local.city = req.body.city;
      newUser.local.password = User.encrypt(password);
      newUser.save(function (err, user) {

      // Error found
      if (err) return done(err, false, {message: 'Something went wrong. Please try again in a few minutes'});

      return done(null, user);
      });
    });
  }));
};
