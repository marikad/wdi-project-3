// Require packages
var Event = require('../models/event');

function allEvents(req, res) {
  Event.find(function (err, events) {
     if (err) return res.status(404).json({message: 'Something went wrong.'});
     res.status(200).json({ events: events });
   });
};

module.exports = {
  allEvents: allEvents
};
