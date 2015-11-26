var async     = require('async');
var Event     = require('../models/event');
var request   = require('request');
var config    = require('../config/config');

var mongoose  = require("mongoose");
mongoose.connect(config.database);

var token = process.env.EVENTFUL_API_KEY;
var baseUrl = "http://api.eventful.com/json/events/search?keywords=";
var keywords = ["hackathon", "javascript", "python", "html5", "css"];
var fetchUrls = [];
var pageUrls = [];

// Push each keyword URLs into array
for (var i = 0; i < keywords.length; i++) {
  var url = baseUrl + keywords[i] + "&l=United+Kingdom&app_key=" + token + "&page_number=";
  pageUrls.push(url);
};

// For each keyword, async call each url and grab the page count, then populate
// the fetch URL array with all URLs to fetch.
var q = async.queue(function (task, done) {
  request(task.url, function(err, res, body) {
    if (err) return console.log(err);
    if (res.statusCode == 200) {
      var data = JSON.parse(body);
      var pageCount = data.page_count;
      console.log(pageCount)
      for (var i = 0; i < pageCount; i++) {
        var finalUrl = task.url + i
        console.log('Pushing URL: ' + finalUrl)
        fetchUrls.push(finalUrl);
      };
    };
  });
}, pageUrls.length);

for (var n = 0; n < pageUrls.length; n++) {
  q.push({url: pageUrls[n]});
};

setTimeout(populateDB, 10000);

function populateDB() {
  console.log('URLs populated. Fetching now')
  var q = async.queue(function (task, done) {
    request(task.url, function(err, res, body) {
      if (err) return console.log(err);
      if (res.statusCode == 200) {
        var data            = JSON.parse(body)
        var events          = data.events.event;
        var keywordPartial  = task.url.split("keywords=");
        var keyword         = keywordPartial[1].split("&");

        for (n in events) {

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
          };

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
    });
  }, fetchUrls.length);

  for (var k = 0; k < fetchUrls.length; k++) {
    q.push({ url: fetchUrls[k]});
  };
};
