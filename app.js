// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const eventRoutes = require("./routes/event.routes");
const {isAuthenticated} = require("./jwt.middleware")


// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cookieParser());

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
app.use(cors({ origin: "http://localhost:5173" }));


// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

/*const allRoutes = require("./routes");
app.use("/api", allRoutes);*/


const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api", require("./routes/user.routes"))
app.use("/api", require("./routes/film.routes"));
app.use("/api", require("./routes/event.routes"));


app.use("/api/events", isAuthenticated, eventRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
