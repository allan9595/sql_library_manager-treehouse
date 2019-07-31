var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// error handler works in dev and producation
app.use((err, req, res, next) => {
  
  res.locals.message = err.message;
  res.locals.error = err ;

  // render the error page
  if(err.status === 404){
    res.render('page-not-found')
  }else{
    res.status(err.status || 500);
    res.render('error');
    console.log(err);
  }
});

module.exports = app;
