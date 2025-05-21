const router = require('express').Router();

const Film = require("../models/Film.models")


router.get("/film", (req, res, next) => {
  Film.find({})
    .then((films) => {
      console.log("Retrieved films ->", films);
      res.json(films);
    })
    .catch((error) => {
      console.error("Error while retrieving films ->", error);
      res.status(500).json({ error: "Failed to retrieve films" });
    });
});



router.post("/film", (req, res) => {
  const newfilm = req.body;
  Film.create(newfilm)
    .then((filmFromDB) => {
      res.status(201).json(filmFromDB);
    })
    .catch((error) => {
      console.log("error creating the film in the DB...", error);
      res.status(500).json({ error: "Failed to create a new film" });
    });
});


router.get("/film/:filmId", (req, res) => {
  const { filmId } = req.params;
  Film.findById(filmId)
    .then((film) => {
      res.status(200).json(film);
    })
    .catch((error) => {
      console.log("There was an error getting this specific film", error);
      res.status(500).json({ message: "Failed to get specific film" });
    });
});





/*router.put("/film/:filmId", (req, res) => {
  const { filmId } = req.params;
  const newDetails = req.body;

  Film.findByIdAndUpdate(filmId, newDetails, { new: true })
    .then((film) => {
      res.status(200).json(film);
    })
    .catch((error) => {
      console.log("There was an error updating the film", error);
      res.status(500).json({ message: "Failed to update specific film" });
    });
});*/

module.exports = router