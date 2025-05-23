const router = require("express").Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

router.get("/users", (req, res, next) => {
  User.find({})
    .select("name _id")
    .then((users) => {
      console.log("Retrieved users ->", users);
      res.json(users);
    })
    .catch((error) => {
      console.error("Error while retrieving users ->", error);
      res.status(500).json({ error: "Failed to retrieve users" });
    });
});

router.get("/users/my-profile", isAuthenticated, (req, res) => {
  const userId = req.payload._id;

  User.findById(userId)
    .select("name _id email")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error("Error retrieving user profile:", error);
      res.status(500).json({ error: "Failed to retrieve the user profile" });
    });
});

module.exports = router;
