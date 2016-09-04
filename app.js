/*
*  author : abhishek goswami
*  abhishekg785@gmail.com
*
*  app.js : main flow of the application, contains all the dependencies
*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config.js');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var searchPanel = require('./routes/searchPanel');

var app = express();

//mysql connection
var db = require('./db_connect');
db.connect(function(err){
  if(err){
    console.log('error occurred: cannot connect to mysql');
  }
  else{
    console.log('connected to the db');
  }
});

// view engine setup
//use ejs for html template
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret : config.secret,
  key : config.key,
  resave : true,
  saveUninitialized : true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/auth', auth);
app.use('/search-panel', searchPanel);

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
