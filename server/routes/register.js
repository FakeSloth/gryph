'use strict';

const bcrypt = require('bcrypt-nodejs');
const config = require('../config');
const db = require('../db');
const jwt = require('jsonwebtoken');
const toId = require('toid');

function register(req, res, next) {
  const username = req.body.username.trim();
  const userId = toId(username);
  if (!username || !req.body.password) return next();
  if (username.length > 19 || req.body.password.length > 300) return next();
  if (db('users').get(userId)) {
    return res.json({msg: 'Someone has already registered this username.'});
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
      if (err) return next(err);
      db('users').set(userId, {username, userId, password: hash});
      const token = jwt.sign({username, userId}, config.jwtSecret, {
        expiresIn: '1 day'
      });
      res.json({token});
    });
  });
}

module.exports = register;
