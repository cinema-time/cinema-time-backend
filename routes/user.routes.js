const router = require("express").Router();

const { isAuthenticated } = require("../jwt.middleware");
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


router.put("/users/edit-profile", isAuthenticated, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = await bcrypt.hash(password, 10); // only hash if present

    const updatedUser = await User.findByIdAndUpdate(
     req.payload._id, // ✅ Use `payload` not `user`
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});




module.exports = router;
