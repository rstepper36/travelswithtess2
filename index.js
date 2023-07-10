const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const models = require('./models');
var usersRouter = require('./routes/users');
var commentsRouter = require('./routes/comments');
var indexRouter = require('./routes/index');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const path = require('path');
const { Image } = require('./models'); // import your Image model

// Load environment variables
require('dotenv').config();


// Create the Express app
const app = express();

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'assets', 'images', 'uploads')); 
  },
  filename: function(req, file, cb) {
    let fileName = new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname);
    cb(null, fileName);
  }
});



const upload = multer({storage: storage});

var postsRouter = require('./routes/posts')(upload); // pass the upload object to the posts router

// Set up the session
app.use(session({
    secret: 'secret',  
    resave: false,
    saveUninitialized: false
}));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Set the static assets to the public/ directory
app.use(express.static(__dirname + '/public'));
app.use(express.json()); // for parsing application/json
// Set all the use statements
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });
  

// Include the routes
app.use('/users', usersRouter); // instead of app.use('/users', usersRouter);
app.use('/posts', postsRouter); // instead of app.use('/posts', postsRoutes);
app.use('/comments', commentsRouter); // instead of app.use('/comments', commentsRoutes);
app.use('/', indexRouter); // instead of app.use('/', indexRoutes);

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack); // log the error stack to your server's console
  res.status(err.status || 500);
  res.render('error', { message: err.message }); // render your error view with the error object
});


// Route for uploading an image
app.post('/upload', upload.single('imageURl'), async (req, res, next) => {
  try {
    const image = await Image.create({ path: req.file.path });
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Sync the database and start listening
models.sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () => {
    console.log('App listening on port 3000!');
  });
});

// Path: index.js
// Entry point for the application
