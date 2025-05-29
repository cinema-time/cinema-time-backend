const express = require("express");
const router = express.Router();
const multer = require("multer");
const Event = require("../models/Events.model");
const { isAuthenticated } = require("../jwt.middleware");
const path = require("path");
const fs = require("fs");
const Film = require("../models/Film.models");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// GET all events
router.get("/events", isAuthenticated, (req, res) => {
  Event.find({})
    .sort({ createdAt: -1 })
    .populate("film", "title") 
    .then((events) => {
      res.json(events);
    })
    .catch((error) => {
      console.error("Error while retrieving events ->", error);
      res.status(500).json({ error: "Failed to retrieve events" });
    });
});

// GET specific event by ID, populate createdBy, participants, and film
router.get("/events/:eventId", isAuthenticated, (req, res) => {
  const { eventId } = req.params;
  Event.findById(eventId)
    .populate("createdBy participants film") // <-- note singular "film"
    .then((event) => {
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(event);
    })
    .catch((error) => {
      console.error("Error retrieving specific event:", error);
      res.status(500).json({ error: "Failed to retrieve the event" });
    });
});

// UPDATE event
router.put("/events/:eventId", isAuthenticated, upload.single("image"), (req, res) => {
  const { eventId } = req.params;
  const newDetails = req.body;

  // If file uploaded, update imageUrl to the new file path
  if (req.file) {
    newDetails.imageUrl = `/uploads/${req.file.filename}`;
  }

  // Parse participants if sent as JSON string
  if (typeof newDetails.participants === "string") {
    try {
      newDetails.participants = JSON.parse(newDetails.participants);
    } catch (e) {
      // leave as is or handle error
    }
  }

  // Parse film if sent as JSON string (single ObjectId expected)
  if (typeof newDetails.film === "string") {
    try {
      newDetails.film = JSON.parse(newDetails.film);
    } catch (e) {
      // leave as is or handle error
    }
  }

  Event.findByIdAndUpdate(eventId, newDetails, { new: true })
    .then((event) => {
      res.set("Cache-Control", "no-store");
      res.status(200).json(event);
    })
    .catch((error) => {
      console.log("There was an error updating the event", error);
      res.status(500).json({ message: "Failed to update specific event" });
    });
});

// CREATE event
router.post("/events", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, location, participants, film } = req.body;

    const newEvent = {
      title,
      description,
      date,
      location,
      createdBy: req.payload._id,
      participants: JSON.parse(participants),
      film: film || null, // parse film ID if sent as JSON string
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const createdEvent = await Event.create(newEvent);

    return res.status(201).json(createdEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE event
router.delete("/events/:eventId", isAuthenticated, (req, res) => {
  const { eventId } = req.params;
  Event.findByIdAndDelete(eventId)
    .then((deletedEvent) => {
      res.status(200).json(deletedEvent);
    })
    .catch((error) => {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete the event" });
    });
});

module.exports = router;
