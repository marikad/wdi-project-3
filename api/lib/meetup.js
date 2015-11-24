var Event = require('../models/event')
var request = require('request');
var config = require('../config/config');

var mongoose = require("mongoose");
mongoose.connect(config.database);

var token = process.env.MEETUP_API_KEY
var url      = "https://api.meetup.com/topics/?search=hackathon&key=" + token;

request(url, function (err, res, body) {
  if (err) return console.log(err);
  if (res.statusCode == 200) {
    var data = JSON.parse(body)

    console.log(data)

    var events = data.results;
    
    for (i in events) {
      if (events[i]) {
        console.log("Event title: " + events[i].name + " Link: " + events[i].link)

        var newEvent = new Event();
        newEvent.title = events[i].name;
        newEvent.city = events[i].city_name;
        newEvent.description = events[i].description;
        newEvent.location = events[i].venue_address;
        newEvent.date = events[i].start_time;

        newEvent.save(function (err, event) {
          if (err) return res.status(500).json(err);
          // console.log(newEvent.title + " saved.")
        });
      };
    };
  };
});