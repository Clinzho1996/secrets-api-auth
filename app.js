require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use("/", bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(3000, () => console.log("App is running on http://localhost:3000"));

mongoose.connect(process.env.MONGODB_API);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = process.env.SECRETS;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/submit", function (req, res) {
  res.render("submit");
});

app.post("/register", async function (req, res) {
  try {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });

    newUser.save();
    res.render("secrets");
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = User.findOne({ email: username });
    if (foundUser || foundUser.password === password) {
      res.render("secrets");
    } else {
      console.log("Error logging in");
    }
  } catch (error) {
    console.log(error);
  }
});
