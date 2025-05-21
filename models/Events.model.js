const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User.model"); 

const eventsSchema = new Schema({
  title: String,
  description: String,
  date: Date,
  imageUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  }],
});

const Event = mongoose.model("Event", eventsSchema);

module.exports = Event;