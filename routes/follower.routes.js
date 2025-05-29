/*const router = require("express").Router();

const { isAuthenticated } = require("../jwt.middleware");
const Follower = require("../models/Follower.model");

router.post('/follow/:id', isAuthenticated, (req, res) => {
    // Find the user and update their followers array
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        user.followers.push(req.user._id);
        user.save((err) => {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'Followed user successfully' });
          }
        });
      }
    });
  });
  
  router.post('/unfollow/:id', (req, res) => {
    // Find the user and update their followers array
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        user.followers.pull(req.user._id);
        user.save((err) => {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'Unfollowed user successfully' });
          }
        });
      }
    });
  });

module.exports = router;*/
