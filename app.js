require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET , excludeFromEncryption: ['email']});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home")
});

app.get("/login", (req, res) => {
  res.render("login")
});

app.get("/register", (req, res) => {
  res.render("register")
});

app.post("/register", (req, res) => {

  const user = new User({
    email: req.body.username,
    password: req.body.password
  });

  user.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {

  User.findOne({email: req.body.username}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.password === req.body.password) {
        res.render("secrets");
      } else {
        res.send("User not found")
      }
    }
  })
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
})
