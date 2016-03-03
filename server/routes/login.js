'use strict';

const bcrypt = require('bcrypt-nodejs');
const db = require('../db');
const jwt = require('jsonwebtoken');
const toId = require('toid');

function login(req, res, next) {
  const username = req.body.username.trim();
  const userId = toId(username);
  if (!username || !req.body.password) return next();
  if (username.length > 19 || req.body.password.length > 300) return next();
  const user = db('users').get(userId);
  if (!user) return res.json({msg: 'Invalid username or password.'});
  bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
    if (err) return next(err);
    if (!isMatch) return res.json({msg: 'Invalid username or password.'});
    const token = jwt.sign({username, userId}, config.jwtSecret, {
      expiresIn: '7 days'
    });
    res.json({token});
  });
}

module.exports = login;
