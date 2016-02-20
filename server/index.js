'use strict';

/**
 * Module dependencies.
 */

const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const compress = require('compression');
const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const path = require('path');
const socketio = require('socket.io');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');

const config = require('./config');
const db = require(config.database.name)(config.database.location);
const sockets = require('./sockets');
const toId = require('../common/toId');

/**
 * Create Express server.
 */

const app = express();
const server = http.Server(app);

/**
 * Create sockets.
 */

const io = socketio(server);

/**
 * App configuration.
 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.set('isDev', app.get('env') !== 'production');

if (app.get('isDev')) {
  // compile react components
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));

  // turn on console logging
  app.use(logger('dev'));
}

app.use(compress());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', config.port);
app.use(express.static(path.join(__dirname, '..', 'public')));

/**
 * App routes.
 */

app.get('/', (req, res) => {
  res.render('index', {title: 'gryph', isDev: app.get('isDev')});
});

app.post('/register', (req, res, next) => {
  const username = req.body.username.trim();
  const userId = toId(username);
  if (!username || !req.body.password) return;
  if (username.length > 19 || req.body.password.length > 300) return;
  if (db('users').get(userId)) {
    return res.json({msg: 'Someone has already registered this username.'});
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
      if (err) return next(err);
      db('users').set(userId, {username, userId, password: req.body.password});
      const token = jwt.sign({username, userId}, config.jwtSecret, {
        expiresInMinutes: 1440 // expires in 24 hours
      });
      res.json({token});
    });
  });
});

app.post('/login', (req, res, next) => {
  const username = req.body.username.trim();
  const userId = toId(username);
  if (!username || !req.body.password) return;
  if (username.length > 19 || req.body.password.length > 300) return;
  const user = Db('users').get(userid);
  if (!user) return res.json({msg: 'Invalid username or password.'});
  bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
    if (err) return next(err);
    if (!isMatch) return res.json({msg: 'Invalid username or password.'});
      const token = jwt.sign({username, userId}, config.jwtSecret, {
        expiresInMinutes: 1440 // expires in 24 hours
      });
      res.json({token});
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/**
 * Handle sockets.
 */

sockets(io);

/**
 * Start Express server.
 */

server.listen(app.get('port'), (error) => {
  if (error) return console.error(error);
  const env = chalk.green(app.get('env'));
  const port = chalk.magenta(app.get('port'));
  console.info('==> Listening on port %s in %s mode.', port, env);
});

module.exports = app;
