const express = require("express");
const router = express.Router();
const multer = require("multer");
const Event = require("../models/Events.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const path = require("path");
const fs = require("fs");

// Configure Multer for file uploads
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

router.get("/events", isAuthenticated, (req, res, next) => {
	Event.find({})
		.sort({ createdAt: -1 })
		.then((events) => {
			console.log("Retrieved events ->", events);
			res.json(events);
		})
		.catch((error) => {
			console.error("Error while retrieving events ->", error);
			res.status(500).json({ error: "Failed to retrieve events" });
		});
});

router.get("/events/:eventId", isAuthenticated, (req, res) => {
	const { eventId } = req.params;
	Event.findById(eventId)
		.populate("createdBy participants")
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

router.put("/events/:eventId", isAuthenticated, upload.single("image"), (req, res) => {
  const { eventId } = req.params;
  const newDetails = req.body;

  // If file uploaded, update imageUrl to the new file path
  if (req.file) {
    newDetails.imageUrl = `/uploads/${req.file.filename}`;
  }

  // If participants is sent as stringified JSON, parse it
  if (typeof newDetails.participants === "string") {
    try {
      newDetails.participants = JSON.parse(newDetails.participants);
    } catch (e) {
      // handle error or keep as string
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

router.post("/events", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, location, participants } = req.body;

    const newEvent = {
      title,
      description,
      date,
      location,
      createdBy: req.payload._id,
      participants: JSON.parse(participants),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    };

    // Save to DB (assuming you have a model)
    const createdEvent = await Event.create(newEvent);

    return res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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
