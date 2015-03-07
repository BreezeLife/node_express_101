var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//connect to mongo
var mongo = require('mongodb'); // we want to talk to mongodb
var mongoose = require('monk'); // we use monk to do it.
var db = mongoose('localhost:27017/node101db'); //our db is located at URL, db is a monk obj

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); //tell the app where to find the views. .serve views objects from the views dir. but to make them actually seem like they're coming from the top level
app.set('view engine', 'jade'); // what engine to render those views




// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //serve static objects from the public dir. but to make them actually seem like they're coming from the top level


//make our db accessible to our router
// we already wrapped our db obj into every request.
app.use(function(req, res, next){
    req.db = db; // add db (monk obj) to every HTTP request(req), it's sub-optimal here.
    next();
});

// app.use statements above are establishing middleware for Express
// They provide custom functions that the rest of your app can make use of.
// They must be put before the route definitions.

//routes definitions
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
