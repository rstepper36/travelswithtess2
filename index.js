require('dotenv').config();  // to load environment variables from .env file
const express = require('express');
const session = require('express-session');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const bodyParser = require('body-parser');
const models = require('./models');
var usersRouter = require('./routes/users');
var commentsRouter = require('./routes/comments');
var indexRouter = require('./routes/index');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { Image } = require('./models'); // import your Image model
const PORT = process.env.PORT || 3000;
const util = require('util');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

// Create the Express app
const app = express();

// Set up multer and AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: process.env.AWS_S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
})

var postsRouter = require('./routes/posts')(upload);

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

// Set up the upload route
app.post('/upload', upload.single('imageURL'), async (req, res, next) => {
  console.log(req.file); // Add this line
  try {
    const image = await Image.create({ path: req.file.location }); // .location gives you the url of the uploaded file
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Sync the database and start listening
models.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
});

// Path: index.js
// Entry point for the application
