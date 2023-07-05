const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const models = require('../models');

router.get('/users/register', (req, res) => {
    res.render('register');
  });
  
// User registration route
router.post('/users/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, function(err, hash) {
    models.User.create({
      username: username,
      password: hash,
      canPost: false // you can set this to false if you want to manually control who can post
    }).then(user => {
      res.redirect('/users/login');
    });
  });
});

router.get('/login', (req, res) => {
    res.render('login');
  });
  
// User login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  models.User.findOne({
    where: {
      username: username
    }
  }).then(user => {
    if (!user) res.redirect('/login');

    bcrypt.compare(password, user.password, function(err, result) {
      if (result) {
        // password matches, log user in
        req.session.user = user;
        res.redirect('/');
      } else {
        // password does not match
        res.redirect('/login');
      }
    });
  });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if(err) {
        console.log(err);
      }
      res.redirect('/');
    });
});

module.exports = router;
