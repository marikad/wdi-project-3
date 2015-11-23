var Event = require('../models/event');
var request = require('request');

function hackathon() {
  request("http://api.eventful.com/json/events/search?keywords=hackathon&app_key=7J9d96cGpbJWRxZV", function (err, res, body) {
    if (err) return console.log(err);
    if (res.statusCode == 200) {
      var data = JSON.parse(body)
      var events = data.events.event;
      addEvents(events)
      res.send("Done")
    };
  });
};

function addEvents(events) {
  for (i in events) {
    if (events[i].country_name == 'United Kingdom') {
      console.log("Event title: " + events[i].title + " Location: " + events[i].city_name + " Venue: " + events[i].venue_address)

      var newEvent = new Event();
      newEvent.title = events[i].title;
      newEvent.city = events[i].city_name;
      newEvent.description = events[i].description;
      newEvent.location = events[i].venue_address;
      newEvent.date = events[i].start_time;

      newEvent.save(function (err, event) {
        if (err) return res.status(500).json(err);
      });
    };
  };
};

module.exports = {
  hackathon: hackathon
};
