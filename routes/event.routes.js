const router = require('express').Router();

const Event = require("../models/Events.model")


router.get("/events", (req, res, next) => {
  Event.find({})
    .then((events) => {
      console.log("Retrieved events ->", events);
      res.json(events);
    })
    .catch((error) => {
      console.error("Error while retrieving events ->", error);
      res.status(500).json({ error: "Failed to retrieve events" });
    });
});



router.get('/events/:eventId', (req, res) => {
  const { eventId } = req.params;
  Event.findById(eventId)
    .populate('createdBy participants')
    .then(event => {
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(200).json(event);
    })
    .catch(error => {
      console.error('Error retrieving specific event:', error);
      res.status(500).json({ error: 'Failed to retrieve the event' });
    });
});



router.put("/events/:eventId", (req, res) => {
  const { eventId } = req.params;
  const newDetails = req.body;

  Event.findByIdAndUpdate(eventId, newDetails, { new: true })
    .then((event) => {
      res.status(200).json(event);
    })
    .catch((error) => {
      console.log("There was an error updating the event", error);
      res.status(500).json({ message: "Failed to update specific event" });
    });
});

router.post('/events', (req, res) => {
  const newEvent = req.body;
  Event.create(newEvent)
    .then(createdEvent => {
      res.status(201).json(createdEvent);
    })
    .catch(error => {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create the event' });
    });
});



router.delete('/events/:eventId', (req, res) => {
  const { eventId } = req.params;
  Event.findByIdAndDelete(eventId)
    .then(deletedEvent => {
      res.status(200).json(deletedEvent);
    })
    .catch(error => {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete the event' });
    });
});


module.exports = router;







