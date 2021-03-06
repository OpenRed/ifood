var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')

var index = require('./routes/index');
var users = require('./users');
var goods = require('./goods');

var app = express();

// view engine setup
app.engine('.html', ejs.__express)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'ifood')));

// catch 未登录 status
app.use(function(req, res, next) {
  if(req.cookies.userId){
    next();
  }
  else{
    if(req.originalUrl=='/users/login' || req.originalUrl=='/users/register' || req.originalUrl=='/users/logout' || req.originalUrl.indexOf('/detail')>-1 || req.originalUrl.indexOf('/goods/list')>-1){
      next();
    }
    else{
      res.json({
        status: '100001',
        msg: '当前状态未登录！',
        result: ''
      });
    }
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

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
