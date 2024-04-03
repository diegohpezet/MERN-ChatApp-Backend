require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const {app, server} = require('./socket/socket')

const authRouter = require('./routes/authRouter');
const usersRouter = require('./routes/usersRouter');
const messagesController = require('./routes/messagesRouter');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // NEW
  credentials: true, // NEW
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesController);

// Set up database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

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
  res.send(`error: ${err}`);
});

server.listen(5000, () => {
  console.log("Server running")
})