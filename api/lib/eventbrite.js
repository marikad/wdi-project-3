var async    = require('async');
var Event    = require('../models/event')
var request  = require('request');
var config   = require('../config/config');

var mongoose = require("mongoose");
mongoose.connect(config.database);

var token     = process.env.EVENTBRITE_PERSONAL_OAUTH_TOKEN;
var baseUrl   = "https://www.eventbriteapi.com/v3/events/search/?q="
var keywords  = ["hackathon", "javascript", "python", "html5", "css"];
var urls      = []

for (var j = 0; j < keywords.length; j++) {
  for (var i = 0; i < 5; i++) {
    var url         = baseUrl + keywords[j] +"&venue.country=GB&token=" + token + "&page=" + i;
    urls.push(url);
  };
};

var q = async.queue(function (task, done) {
  request(task.url, function(err, res, body) {
    if (err) return console.log(err);
    if (res.statusCode == 200) {
      var data            = JSON.parse(body)
      var events          = data.events;
      var keywordPartial  = task.url.split("q=");
      var keyword         = keywordPartial[1].split("&");

      for (n in events) {


          console.log("Event title: " + events[n].name.text + " Description: " + events[n].description.text + "Date " + events[n].start.local + " Venue Id" + events[n].venue_id)
          

          var newEvent          = new Event();
          newEvent.title        = events[n].name.text;
          // newEvent.city         = events[n].city_name;
          newEvent.description  = events[n].description.text;
          // newEvent.location     = (events[n].venue_address + ", " + events[n].city_name);
          newEvent.date         = events[n].start.local;
          newEvent.category     = keyword[0];

          newEvent.save(function (err, event) {
            if (err) return res.status(500).json(err);
            console.log(newEvent.title + " saved. keywords was: " + newEvent.category);
          });

      };
    };
  });
}, urls.length);

for (var k = 0; k < urls.length; k++) {
  q.push({ url: urls[k]});
};