var Event    = require('../models/event')
var request  = require('request');
var config   = require('../config/config');

var mongoose = require("mongoose");
mongoose.connect(config.database);

var token    = process.env.EVENTBRITE_PERSONAL_OAUTH_TOKEN;
var base_url = "https://www.eventbriteapi.com/v3/events/search/?token="
var keywords = "hackathon";
var url      = base_url + token + "&q=" + keywords;

console.log("-1");
console.log(url);

request(url, function (err, res, body) {
  console.log("0");
  if (err) return console.log(err);
  if (res.statusCode !== 200)  return false;

  var data = JSON.parse(body)
  // console.log(data)

  var events = data.events;

  console.log("1");
  events.forEach(function(hackathon) {
    if (hackathon.venue_id === null || !hackathon.venue_id) return false;

    var venueURL = "https://www.eventbriteapi.com/v3/venues/" + hackathon.venue_id + "/?token=" + token;
    // console.log(venueURL);

    console.log("2");
    request(venueURL, function(error, response, venueBody){
      console.log("3");
      console.log(error, response.body, venueBody);
      
      if (error) return console.log(error);
      if (response.statusCode !== 200) return false;

      // var venue = JSON.parse(venueBody)
      // console.log(venue);      
    })

    // request(venueURL, function (err, res, body){
    //   if (err) return console.log(err);
    //   if (res.statusCode !== 200) return false;

    //   var venueData = JSON.parse(body)
    //   var venue = venueData.venue

    //   // var newEvent = new Event();
    //   // newEvent.title = events[i].name.text;
    //   // // newEvent.city = events[i].city_name;
    //   // newEvent.description = events[i].description.text;
    //   // // newEvent.location = events[i].venue_address;
    //   // newEvent.date = events[i].start.local;

    //   // newEvent.save(function (err, event) {
    //   //   if (err) return res.status(500).json(err);
    //   //   console.log(newEvent.title + " saved.")
    //   // });

    //   };
    // })
  })
});

