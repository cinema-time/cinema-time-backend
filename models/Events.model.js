const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User.model"); 
const Film = require("./Film.models"); // Adjust path accordingly


const eventsSchema = new Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  imageUrl: String,
 film: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "Film",
  },
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
}, {timestamps: true});

const Event = mongoose.model("Event", eventsSchema);

module.exports = Event;