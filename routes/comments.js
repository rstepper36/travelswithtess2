const express = require('express');
const router = express.Router();
const models = require('../models');

// Route for creating a new comment
router.post('/create', (req, res) => {
    const { postId, content } = req.body;
    
    let commentData = {
      content: content,
      PostId: postId
    };
    
    if (req.session.user) {
      commentData.UserId = req.session.user.id;
    }
  
    models.Comment.create(commentData)
    .then(comment => {
      res.redirect('/posts/' + postId);
      })
      .catch(err => {
        next(err);
    });
  });
  

module.exports = router;
