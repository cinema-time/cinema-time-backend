const { url } = require("inspector");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filmSchema = new Schema({
   title: String,
  description: String,
  director: String,
  year: Number,
  genre: String,
  iMDB:String
})

const Film = mongoose.model("film", filmSchema);

module.exports = Film;