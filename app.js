//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { stringify } = require("querystring");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// this is for for mongoose to connect to our mongoDB server called userDB
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// this is the start of database stuff

const userSchema = {
  email: String,
  password: String,
};
const User = new mongoose.model("User", userSchema);

// this is the start of the redirecting

// takes you to the home route
app.get("/", function (req, res) {
  res.render("home");
});
// takes you to the login page
app.get("/login", function (req, res) {
  res.render("login");
});
// takes you to the register page
app.get("/register", function (req, res) {
  res.render("register");
});
// this is the registered route and this is used to save the registered infomration that was entered into the field
app.post("/register", function (req, res) {
  const newUser = new User({
    // this is using the the info in register.ejs to populate info from that page
    email: req.body.username,
    password: req.body.password,
  });
  //   this saves the user to the database and checks for errors and renders secrets page at the end
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      // so the secrets route is only rendered once the user registers or logs in
      res.render("secrets");
    }
  });
});

// this is used to render the login page and check is a user with said information already has an account here
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  //   this looks though database
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        //   this is check the document for password entered and checking if it matches what we have
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
