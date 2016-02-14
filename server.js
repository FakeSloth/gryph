'use strict';

/**
 * Module dependencies.
 */

const chalk = require('chalk');
const compress = require('compression');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const socketio = require('socket.io');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');

const config = require('./config');
const sockets = require('./sockets');

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
app.set('port', config.port);
app.use(express.static(path.join(__dirname, 'public')));

/**
 * App routes.
 */

app.get('/', (req, res) => {
  res.render('index', {title: 'gryph', isDev: app.get('isDev')});
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
