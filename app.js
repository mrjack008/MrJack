var createError = require('http-errors');
var express = require('express');
var path = require('path');
var hbs = require('hbs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload=require('express-fileupload')
var db = require('./config/connection')
var userRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
// var fileUpload = require('express-fileupload')
var app = express();
var nocache = require('nocache')
var session = require('express-session')
var Handlebars = require('handlebars');

 

 

 
 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname+'/views/partials')
hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
hbs.registerHelper('Placed',(value)=>{
  return value == 'Placed' || value=='Delivered'?true : false
})
hbs.registerHelper('Danger',(value)=>{
  return value == 'Cancelled' ? true : false
})
app.use(nocache())
app.use(fileUpload())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "secret-key", cookie: { maxAge: 600000 },resave:false,saveUninitialized:true, }));

db.connect((err)=>{
  if(err) console.log("connection error"+err);
  else console.log("Database connected to port 27017");
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

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