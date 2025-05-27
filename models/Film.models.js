const { url } = require("inspector");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filmSchema = new Schema({
   title: String,
  description: String,
  image:String,
  director: String,
  year: Number,
  genre: String,
  iMDB:String,
  rating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5 
  }
})

const Film = mongoose.model("Film", filmSchema);

module.exports = Film;