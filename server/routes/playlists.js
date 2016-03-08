'use strict';

const config = require('../config');
const db = require('../db');
const jwt = require('jsonwebtoken');

function playlists(req, res) {
  if (!req.body.playlists) return;
  jwt.verify(req.body.token, config.jwtSecret, (err, decoded) => {
    if (err) return next(err);
    db('playlists').set(decoded.userId, req.body.playlists);
    res.json({success: true});
  });
}

module.exports = playlists;
