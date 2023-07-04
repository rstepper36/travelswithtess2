const express = require('express');
const router = express.Router();
const models = require('../models');

// Route for creating a new comment
router.post('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  const { postId, content } = req.body;
  models.Comment.create({
    content: content,
    PostId: postId,
    UserId: req.session.user.id
  }).then(comment => {
    res.redirect('/posts/' + postId);
  });
});

module.exports = router;
