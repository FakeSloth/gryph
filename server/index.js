'use strict';

/**
 * Module dependencies.
 */

const bodyParser = require('body-parser');
const chalk = require('chalk');
const compress = require('compression');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const socketio = require('socket.io');
const winston = require('winston');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');

const config = require('./config');
const sockets = require('./sockets');

const homeRoute = require('./routes');
const authRoute = require('./routes/auth');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const searchRoute = require('./routes/search');

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

if (config.isDev) {
  // compile react components
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));

  // turn on console logging
  app.use(logger('dev'));
}

app.use(compress());
app.use(favicon(path.join(__dirname, '../public/favicon.ico'), {
  maxAge: config.faviconCache
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', config.port);
app.use(express.static(path.join(__dirname, '..', 'public')));

/**
 * App routes.
 */

app.get('/', homeRoute);
app.post('/auth', authRoute);
app.post('/login', loginRoute);
app.post('/register', registerRoute);
app.post('/search', searchRoute);

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
  if (error) return winston.error(error);
  const env = chalk.green(app.get('env'));
  const port = chalk.magenta(app.get('port'));
  winston.info('==> Listening on port %s in %s mode.', port, env);
});

module.exports = server;
