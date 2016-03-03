'use strict';

const config = require('../config');

function home(req, res) {
  res.render('index', {title: 'gryph', isDev: config.isDev});
}

module.exports = home;
