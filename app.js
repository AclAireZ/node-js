var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
const authorizationUser = require('./middleware/userPass')

// const verfyToken = require('./middleware/jwt_decode');

var app = express();
var cors = require('cors');
// require('./db')
const {DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME} = process.env
// mongodb://127.0.0.1:27017/ex




mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  // user: DB_USER,
  // pass: DB_PASS,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {
  console.log('DB connect!!')
}).catch(err => {
  console.log(err.message)
})


app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/registers', usersRouter);
app.use('/', indexRouter);
app.use('/products',authorizationUser, productsRouter);
app.use('/orders',authorizationUser, ordersRouter);

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
