var Event = require('../models/event')
var request = require('request');
var config = require('../config/config');

var mongoose = require("mongoose");
mongoose.connect(config.database);


var token = process.env.EVENTBRITE_PERSONAL_OAUTH_TOKEN;
var base_url = "https://www.eventbriteapi.com/v3/events/search/?token="
// var keywords = "hackathon";
var url      = base_url + token + "&q=hackathon";

request(url, function (err, res, body) {
  if (err) return console.log(err);
  if (res.statusCode == 200) {
    var data = JSON.parse(body)

    // console.log(data)
    var events = data.events;

    for (i in events) {

    // var venueURL = "https://www.eventbriteapi.com/v3/venues/" + events[i].venue_id + "/?token" + token;

      if (events[i].start.timezone == 'Europe/London') {
        console.log("Event title: " + events[i].name.text + " Description: " + events[i].description.text + "Date " + events[i].start.local + " Venue: " + events[i].venue_id)

        // var newEvent = new Event();
        // newEvent.title = events[i].name.text;
        // // newEvent.city = events[i].city_name;
        // newEvent.description = events[i].description.text;
        // // newEvent.location = events[i].venue_address;
        // newEvent.date = events[i].start.local;

        // newEvent.save(function (err, event) {
        //   if (err) return res.status(500).json(err);
        //   console.log(newEvent.title + " saved.")
        // });
      };
    };
  };
});

