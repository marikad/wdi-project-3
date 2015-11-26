var async     = require('async');
var Event     = require('../models/event');
var request   = require('request');
var config    = require('../config/config');

var mongoose  = require("mongoose");
mongoose.connect(config.database);

var token     = process.env.EVENTFUL_API_KEY;
var baseUrl   = "http://api.eventful.com/json/events/search?keywords=";
var keywords  = ["hackathon", "javascript", "python"];
var urls      = []

for (var j = 0; j < keywords.length; j++) {
  for (var i = 0; i < 19; i++) {
    var url = baseUrl + keywords[j] + "&app_key=" + token + "&page_number="+ i
    urls.push(url);
  };
};

var q = async.queue(function (task, done) {
  request(task.url, function(err, res, body) {
    if (err) return console.log(err);
    if (res.statusCode == 200) {
      var data            = JSON.parse(body)
      var events          = data.events.event;
      var keywordPartial  = task.url.split("keywords=");
      var keyword         = keywordPartial[1].split("&");

      for (n in events) {
        if (events[n].country_name == 'United Kingdom') {

          var newEvent          = new Event();
          newEvent.title        = events[n].title;
          newEvent.city         = events[n].city_name;

          try {
            newEvent.image      = events[n].image.medium.url
            // console.log('SUCCESSFULLY ADDED: ' + newEvent.image)
          }
          catch(err) {
            // console.log(err);
            newEvent.image      = 'http://www.fillmurray.com/200/200'
          }

          newEvent.description  = events[n].description;
          newEvent.location     = (events[n].venue_address + ", " + events[n].city_name);
          newEvent.date         = events[n].start_time;
          newEvent.category     = keyword[0];

          newEvent.save(function (err, event) {
            if (err) return res.status(500).json(err);
            console.log(newEvent.title + " saved. keywords was: " + newEvent.category);
          });
        };
      };
    };
  });
}, urls.length);

for (var k = 0; k < urls.length; k++) {
  q.push({ url: urls[k]});
};
