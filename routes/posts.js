const express = require('express');
const router = express.Router();
const models = require('../models');

// Route for creating a new post
router.post('/create', (req, res) => {
  if (!req.session.user || !req.session.user.canPost) {
    return res.redirect('/login');
  }

  const { title, content } = req.body;
  models.Post.create({
    title: title,
    content: content,
    UserId: req.session.user.id
  }).then(post => {
    res.redirect('/posts/' + post.id);
  }).catch(err => console.log(err));
});

// Route for getting a single post
router.get('/:id', (req, res) => {
  models.Post.findByPk(req.params.id, {
    include: [{
      model: models.Comment,
      include: [models.User]
    }, models.User]
  }).then(post => {
    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.render('post', {
      post: post
    });
  }).catch(err => console.log(err));
});

module.exports = router;
