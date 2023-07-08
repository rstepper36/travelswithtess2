// export a function that takes upload as a parameter
module.exports = (upload) => {
  const express = require('express');
  const router = express.Router();
  const models = require('../models');

  router.get('/create', (req, res) => {
    if (!req.session.user || !req.session.user.canPost) {
      return res.redirect('/login');
    }
    res.render('create'); // render create view
  });

  router.get('/', (req, res) => {
    models.Post.findAll({
        include: [{
            model: models.Comment,
            include: [models.User]
        }, models.User]
    })
    .then(posts => {
        if (posts.length === 0) {
            return res.render('no-posts'); // no posts render no-posts view
        }
        res.render('posts', { posts: posts }); // render posts view
    })
    .catch(err => {
       res.render('error', { error: err });
    });
  });

  router.post('/create', upload.single('imageURL'), (req, res) => {
    if (!req.session.user || !req.session.user.canPost) {
      return res.redirect('/login');
    }

    const { title, content } = req.body;
    const imageURL = req.file ? req.file.filename : null; // if there is a file, set imageURL to the filename, otherwise set to null

    models.Post.create({
      title: title,
      content: content,
      UserId: req.session.user.id,
      imageURL: imageURL // set imageURL to the filename or null
    })
    .then(post => {
      res.redirect('/posts/' + post.id);
    })
    .catch(err => {
      res.render('error', { error: err });
    });
  });

  router.post('/:id', (req, res) => {
    const { content } = req.body;
    models.Comment.create({
      content: content,
      PostId: req.params.id,
      UserId: req.session.user.id
    }).then(comment => {
      res.redirect('/posts/' + req.params.id);
    });
  });

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
      res.render('post', { post: post });
    }).catch(err => {
       res.render('error', { error: err });
    });
  });

  return router;
};
