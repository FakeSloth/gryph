'use strict';

const db = require('../db');
const toId = require('toid');

function auth(req, res) {
  if (db('users').get(toId(req.body.name))) {
    return res.json({msg: 'This username is registered.'});
  }
  return res.json({success: true});
}

module.exports = auth;
