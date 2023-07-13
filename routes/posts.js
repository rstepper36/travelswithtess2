// export a function that takes upload as a parameter
module.exports = (upload) => {
  const express = require('express');
  const router = express.Router();
  const models = require('../models');

  router.get('/create', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/users/login');
    }
    if (!req.session.user.canPost) {
      return res.render('no-perms'); // render no-perms view
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
      next(err);
    });
  });

  // Route for creating a post and uploading an image
  router.post('/create', upload.single('imageURL'), (req, res, next) => {
    if (!req.session.user || !req.session.user.canPost) {
      return res.redirect('/users/login');
    }

    const { title, content } = req.body;
    const imageURL = req.file ? req.file.location : null; // here .location will provide you with the URL of the uploaded file

    models.Post.create({
      title: title,
      content: content,
      UserId: req.session.user.id,
      imageURL: imageURL
    })
    .then(post => {
      res.redirect('/posts/' + post.id);
    })
    .catch(err => {
      next(err);
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
      next(err);
    });
  });

    // Route for showing the edit form
    router.get('/:id/edit', (req, res, next) => {
      if (!req.session.user) {
        return res.redirect('/users/login');
      }
      models.Post.findByPk(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).send('Post not found');
          }
          if (req.session.user.id !== post.UserId) {
            return res.status(403).send('You do not have permission to edit this post');
          }
          res.render('edit', { post: post });
        })
        .catch(err => {
          next(err);
        });
    });
  
    // Route for updating a post
    router.put('/:id', upload.single('imageURL'), (req, res, next) => {
      if (!req.session.user) {
        return res.redirect('/users/login');
      }
      const { title, content } = req.body;
      const imageURL = req.file ? req.file.location : null;
  
      models.Post.findByPk(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).send('Post not found');
          }
          if (req.session.user.id !== post.UserId) {
            return res.status(403).send('You do not have permission to edit this post');
          }
          return post.update({
            title: title,
            content: content,
            imageURL: imageURL || post.imageURL // Keep the old image if a new one was not uploaded
          });
        })
        .then(post => {
          res.redirect('/posts/' + post.id);
        })
        .catch(err => {
          next(err);
        });
    });
  

  return router;
};
// Path: routes/posts.js
// router file for posts
