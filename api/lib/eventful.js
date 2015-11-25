var Event = require('../models/event');
var request = require('request');
var config = require('../config/config');

var mongoose = require("mongoose");
mongoose.connect(config.database);

var token = process.env.EVENTFUL_API_KEY;
var base_url = "http://api.eventful.com/json/events/search?keywords="
var keywords = "hackathon";

for (var i = 0; i < 18; i++) {
  var page_number = i
  var url      = base_url + keywords + "&app_key=" + token + "&page_number="+ page_number;

  request(url, function (err, res, body) {
    if (err) return console.log(err);
    if (res.statusCode == 200) {
      var data = JSON.parse(body)

      var events = data.events.event;

      for (i in events) {
        if (events[i].country_name == 'United Kingdom') {
          console.log("Event title: " + events[i].title + " Location: " + events[i].city_name + " Venue: " + events[i].venue_address)

          var newEvent = new Event();
          newEvent.title = events[i].title;
          newEvent.city = events[i].city_name;
          newEvent.description = events[i].description;
          newEvent.location = (events[i].venue_address + ", " + events[i].city_name);
          newEvent.date = events[i].start_time;

          newEvent.save(function (err, event) {
            if (err) return res.status(500).json(err);
            console.log(newEvent.title + " saved.")
          });
        };
      };
    };
  });
};
