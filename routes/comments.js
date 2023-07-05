const express = require('express');
const router = express.Router();
const models = require('../models');

// Route for creating a new comment
router.post('/comments/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/users/login');
  }

  const { postId, content } = req.body;
  models.Comment.create({
    content: content,
    PostId: postId,
    UserId: req.session.user.id
  }).then(comment => {
    res.redirect('/posts/posts/' + postId);
  });
});

module.exports = router;
