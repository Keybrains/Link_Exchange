require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const initMongo = require('./config.js/mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const SignupRouter = require('./routes/Signup');
const AdminSignupRouter = require('./routes/AdminSignup');
const WebSiteRouter = require('./routes/Website');
const OtherUserWebSiteRouter = require('./routes/OtherUserWebsite');
const ReportedWebSiteRouter = require('./routes/ReportedWebsite');
const ChatWebSiteRouter = require('./routes/ChatMessage');
const NotificationRouter = require('./routes/Notification');
const CdnRouter = require('./routes/cdn');
const ProjectRouter = require('./routes/Project');
const CategoryRouter = require('./routes/Category');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/signup', SignupRouter);
app.use('/api/adminsignup', AdminSignupRouter);
app.use('/api/website', WebSiteRouter);
app.use('/api/reportedwebsite', ReportedWebSiteRouter);
app.use('/api/otheruserwebsite', OtherUserWebSiteRouter);
app.use('/api/chatuser', ChatWebSiteRouter);
app.use('/api/notification', NotificationRouter);
app.use('/api/cdn', CdnRouter);
app.use('/api/projects', ProjectRouter);
app.use('/api/categorys', CategoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Init MongoDB
initMongo();

module.exports = app;
