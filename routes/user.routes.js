const router = require('express').Router();

const User = require("../models/User.model");


router.get("/users", (req, res, next) => {
  User.find({})
    .then((users) => {
      console.log("Retrieved users ->", users);
      res.json(users);
    })
    .catch((error) => {
      console.error("Error while retrieving users ->", error);
      res.status(500).json({ error: "Failed to retrieve users" });
    });
});



router.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
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



router.put("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const newDetails = req.body;

  User.findByIdAndUpdate(userId, newDetails, { new: true })
    .then((event) => {
      res.status(200).json(event);
    })
    .catch((error) => {
      console.log("There was an error updating the user", error);
      res.status(500).json({ message: "Failed to update specific user" });
    });
});

router.post('/users', (req, res) => {
  const newUser = req.body;
  User.create(newUser)
    .then(createdUser => {
      res.status(201).json(createdUser);
    })
    .catch(error => {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create the user' });
    });
});



router.delete('/users/:userId', (req, res) => {
  const { userId } = req.params;
  User.findByIdAndDelete(userId)
    .then(deletedUser => {
      res.status(200).json(deletedUser);
    })
    .catch(error => {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete the user' });
    });
});


module.exports = router;







