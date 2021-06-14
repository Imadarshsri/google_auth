require("dotenv").config();
const hbs = require("hbs");
const path = require("path");
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth.js')

const app = express();
const port = process.env.PORT || 5000;

//Configure Passport
app.use(passport.initialize());
app.use(passport.session());
/// Adds json decoding
app.use(express.json());


// app.set('view engine', 'ejs');

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'SECRET'
}));

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../frontend/public");
const viewsPath = path.join(__dirname, "../frontend/templates/views");
const partialsPath = path.join(__dirname, "../frontend/templates/partials");

// Setup handlebars engine & views Location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static to serve
app.use(express.static(publicDirectoryPath));

// app.get('/', function (req, res) {
//   res.render('pages/auth');
// });

app.get("", (req, res) => {
  res.render("auth", {
    title: "Google Auth OAuth2.0 Cloud Service",
    name: "Adarsh Srivastava",
  });
});


app.get('/success', (req, res) => {
  console.log("Success", req.session.passport.user);
  res.render('success', {
    user: req.session.passport.user
  });
});

app.get('/error', (req, res) => {
  res.send("error logging in");
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/error'
  }),
  function (req, res) {
    res.redirect('/success');
  });

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

// 404 Error
app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Adarsh Srivastava",
    errorMessage: "Page Not Found!",
  });
});

app.listen(port, () => console.log('App listening on port ' + port));