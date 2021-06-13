require("dotenv").config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth.js')

const app = express();
const port = process.env.PORT || 5000;

//Configure Passport
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.get('/', function (req, res) {
  res.render('pages/auth');
});

app.get('/success', (req, res) => {
  console.log("Success", req.session.passport.user);
  res.render('pages/success', {
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

//todo: Logout
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

app.listen(port, () => console.log('App listening on port ' + port));