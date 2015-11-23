var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var User = require('../models/user');

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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

  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
))};
