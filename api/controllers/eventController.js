// Require packages
var Event = require('../models/event');

function allEvents(req, res) {
  Event.find(function (err, events) {
     if (err) return res.status(404).json({message: 'Something went wrong.'});
     res.status(200).json({ events: events });
   });
};

function newEvent(req,res) {
  var event = new Event(req.body);

  event.save(function (err) {
    if (err) return res.status(500).json({message: "Error saving new event."})
    res.status(201).json({event: event});
  });
};

module.exports = {
  allEvents: allEvents,
  newEvent: newEvent
};
