// Require packages
var express = require('express');
var cors = require('cors');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
var mongoose = require('mongoose');
var passport = require('passport');
var methodOverride = require("method-override");
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');
var oauthshim = require('./config/shim');
var creds = require("./config/credentials")

// Require relative files
var config = require('./config/config');
var routes = require('./config/routes');
var secret = require('./config/config').secret; // Set up secret used by JWT
require('./config/passport')(passport);

// Hook into mongoDB via mongoose
var databaseUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/hackjammer';
mongoose.connect(databaseUrl);

// Create App
var app = express();

// Set our app to use packages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());

// Set-up method-override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  };
}));

// Define a path where to put this OAuth Shim
app.all('/proxy', oauthshim);

// Initiate the shim with credentials
oauthshim.init(creds);

// Set app to use JWTs when called though '/api'
app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
      { url: '/api/register', methods: ['POST'] },
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/github', methods: ['POST']},
      { url: '/api/events', methods: ['GET'] }
    ]
  }));

// Display user friendly error when 401 occurs
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Unauthorized request.'});
  };
  next();
});

// Tell app to use routing via the '/api' sub-domain
app.use("/api", routes);

app.listen(3000);
console.log("Express is alive and listening on port 3000.");
