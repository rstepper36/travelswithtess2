const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const models = require('./models');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');
var commentsRouter = require('./routes/comments');
var indexRouter = require('./routes/index');



const app = express();

app.use(session({
    secret: 'secret',  
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Include the routes
app.use('/', usersRouter); // instead of app.use('/users', usersRouter);
app.use('/', postsRouter); // instead of app.use('/posts', postsRoutes);
app.use('/', commentsRouter); // instead of app.use('/comments', commentsRoutes);
app.use('/', indexRouter); // instead of app.use('/index', indexRoutes);

models.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('App listening on port 3000!');
  });
});
