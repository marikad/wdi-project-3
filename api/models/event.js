var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
  title: String,
  city: String,
  description: String,
  location: String,
  date: String
});

module.exports = mongoose.model("Event", eventSchema);