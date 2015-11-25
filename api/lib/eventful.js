var Event     = require('../models/event');
var request   = require('request');
var config    = require('../config/config');

var mongoose  = require("mongoose");
mongoose.connect(config.database);

var token     = process.env.EVENTFUL_API_KEY;
var baseUrl  = "http://api.eventful.com/json/events/search?keywords=";
var keywords  = ["hackathon", "javascript", "python"];
var urls = []

for (var j = 0; j < keywords.length; j++) {
  for (var i = 0; i < 19; i++) {
    var url = baseUrl + keywords[j] + "&app_key=" + token + "&page_number="+ i
    urls.push(url);
  };
};

for (var k = 0; k < urls.length-1; k++) {

  // BUG: Request does not act on each loop, instead it waits for the for loop to complete every iteration, and then executes urls.length - 1 times the last entry in urls.

  // http://stackoverflow.com/questions/24710989/how-do-i-make-http-requests-inside-a-loop-in-nodejs

  request(urls[k], function (err, res, body) {
    console.log('Now requesting ' + urls[k]);
    if (err) return console.log(err);
    if (res.statusCode == 200) {
      var data = JSON.parse(body)
      var events = data.events.event;
      // var category = urls[n].split("keywords=");

      for (n in events) {
        if (events[n].country_name == 'United Kingdom') {
          // console.log("Event title: " + events[n].title + " Location: " + events[n].city_name + " Venue: " + events[n].venue_address)

          var newEvent = new Event();
          newEvent.title = events[n].title;
          newEvent.city = events[n].city_name;
          newEvent.description = events[n].description;
          newEvent.location = (events[n].venue_address + ", " + events[n].city_name);
          newEvent.date = events[n].start_time;
          // newEvent.category = ;

          newEvent.save(function (err, event) {
            if (err) return res.status(500).json(err);
            // console.log(newEvent.title + " saved.");
          });
        };
      };
    };
  });
};
