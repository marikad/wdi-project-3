var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
  title: String,
  city: String,
  image: String,
  description: String,
  location: String,
  date: String,
  category: String
});

module.exports = mongoose.model("Event", eventSchema);