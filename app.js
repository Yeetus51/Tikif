const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//routes
const indexRouter = require('./routes/index');
const mainRouter = require('./routes/main');
const accountRouter = require("./routes/account");
const createPostRouter = require("./routes/createPost");


//auth
const session = require('express-session');
const passport = require("./auth.js");

const app = express();

require("./ConnectMongoose"); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/main', ensureAuthenticated, mainRouter);
app.use("/account", ensureAuthenticated, accountRouter);
app.use("/create_post", ensureAuthenticated, createPostRouter); 

// app.use("/awareness", ensureAuthenticated,awarenessRouter);
// app.use("/acceptance", ensureAuthenticated,acceptanceRouter);
// app.use("/adoption", ensureAuthenticated,adoptionRouter);
// app.use("/implementation", ensureAuthenticated, implementationRouter);

function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/');  // Redirect to login page
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
