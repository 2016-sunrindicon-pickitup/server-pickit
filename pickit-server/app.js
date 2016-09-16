var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var UUID = require('node-uuid');

var routes = require('./routes/index');

var app = express();
var verbase = false;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/listendb');
var db = mongoose.connection;

var UserSchema = new mongoose.Schema({
        email: { type : String, required:true, unique:true},
        passwd: { type : String, required:true},
        nickname: { type : String, required:true, unique:true},
        isLogined: {type: Boolean, required:true, default: false},
        Level: {type: Number, default: 0},
        score: {type: Number, default: 0},
        exp: {type: Number, default: 0},

        PlayedVid: [{
          Vid : {type: String},
          cnt : {type: Number, default: 0},
          word : [{type: String}],
          HowmanyWrong : [{type: Number}],
          HowmanyPlay: { type: Number},
          playtime : {type: Number, default: 0},
          playtimeAg : {type: Number, default: 0}
        }],

        HowMany_wrongs: {type: String}
});

Users = mongoose.model('users',UserSchema);

var VidSchema = new mongoose.Schema({
        name: {type: String, required:true, unique:true},
        vid: {type: String, required:true, unique:true},
        tag: {type: String, required: true},
        intro: {type: String, required: true}
});

Vids = mongoose.model('vids', VidSchema);

var roomSchema = new mongoose.Schema({
          room: {type: String},
          username: {type: String},
          vid: {type: String},
});

Rooms = mongoose.model('room', roomSchema);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));


//url
app.use('/', routes);

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
