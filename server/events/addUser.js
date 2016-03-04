'use strict';

const _ = require('lodash');
const Users = require('../users');
const config = require('../config');
const db = require('../db');
const jwt = require('jsonwebtoken');
const toId = require('toid');

function addUser(io, socket, data) {
  const handleAddUser = addUserHandler.bind(null, io, socket);

  if (!_.isObject(data) || (_.isObject(data) && !data.name)) return;
  const username = data.name;
  const userId = toId(username);
  if (!userId || userId.length > 19) return;

  if (socket.userId === userId) {
    if (db('users').get(userId) && data.token) {
      return jwt.verify(data.token, config.jwtSecret, (err) => {
        if (err) return socket.emit('error token');
        handleAddUser(username, true);
      });
    }
    return handleAddUser(username);
  }

  if (Users.get(userId)) return;

  if (db('users').get(userId)) {
    if (!data.token) return;
    jwt.verify(data.token, config.jwtSecret, (err, decoded) => {
      if (err) return socket.emit('error token');
      if (decoded.userId !== userId) return;
      handleAddUser(username, true);
    });
  } else {
    handleAddUser(username);
  }
}

function addUserHandler(io, socket, username, isRegistered) {
  if (!socket.userId || !Users.get(socket.userId)) {
    socket.userId = Users.create(username, socket);
  } else {
    Users.get(socket.userId).setName(username);
  }

  if (isRegistered) {
    Users.get(socket.userId).isRegistered = true;
  }

  io.emit('update userlist', Users.list());
}

module.exports = addUser;
