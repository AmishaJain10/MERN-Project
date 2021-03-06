const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//Body parse middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;
const dbOptions = {
  useNewUrlParser: true,
  auth: {
    user: require("./config/keys").mongoUser,
    password: require("./config/keys").mongoPassword
  }
};

//connect to MongoDB
mongoose
  .connect(db, dbOptions)
  .then(() => console.log("Mongo DB connected"))
  .catch(err => console.log(err));

//app.get("/", (req, res) => res.send("Hello Amisha Jain... "));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport.js")(passport);

//use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//server static assets when in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
