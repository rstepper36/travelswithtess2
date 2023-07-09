const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const models = require('../models');

router.get('/register', (req, res) => {
    res.render('register');
  });
  
// User registration route
router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  models.User.findOne({ where: { username: username }})
  .then(user => {
      if(user) {
          // User already exists
          let error = new Error('User already exists');
          error.status = 400;
          throw error;
      } else {
          // Hash the password before saving it to the database
          return bcrypt.hash(password, 10);
      }
  })
  .then(hash => {
      return models.User.create({
          username: username,
          password: hash,
          canPost: false // You can set this to false if you want to manually control who can post
      });
  })
  .then(user => {
      res.redirect('/login');
  })
  .catch(err => {
      next(err);
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
    if (!user) res.redirect('/login'); // user not found

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
