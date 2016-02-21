'use strict';

const _ = require('lodash');
const Users = require('./users');
const toId = require('../common/toId');
const parser = require('./parser');
const config = require('./config');
const db = require('./db');
const jwt = require('jsonwebtoken');

let chatHistory = [];

function sockets(io) {
  io.on('connection', (socket) => {
    connection(io, socket);
  });
}

function connection(io, socket) {
   socket.emit('update messages', chatHistory);
   socket.emit('update userlist', Users.list());

   function handleAddUser(username) {
     if (!socket.userId) {
       socket.userId = Users.create(username, socket);
     } else {
       Users.get(socket.userId).setName(username);
     }

     io.emit('update userlist', Users.list());
   }

  socket.on('add user', (data) => {
    if (!_.isObject(data) || (_.isObject(data) && !data.name)) return;
    const username = data.name;
    const userId = toId(username);
    if (!userId || userId.length > 19) return;

    if (socket.userId === userId) {
      Users.get(socket.userId).setName(username);
      return io.emit('update userlist', Users.list());
    }

    if (Users.get(userId)) return;

    if (db('users').has(userId)) {
      if (!data.token) return;
      jwt.verify(data.token, config.jwtSecret, (err, decoded) => {
        if (err) return;
        if (decoded.userId !== userId) return;
        handleAddUser(username);
      });
    } else {
      handleAddUser(username);
    }
  });

  /**
   * A chat message event.
   *
   * @params {Object} msg - {text: String, username: String, className: string}
   */

  socket.on('chat message', (msg) => {
    if (!_.isObject(msg) || (_.isObject(msg) && !msg.text)) return;
    if (!msg.text.trim() || msg.text.length > 300) return;

    if (msg.username) {
      if (toId(msg.username) !== socket.userId) return;
      msg.text = parser(msg.text);
    }

    pushToChatHistory(msg);
    chatHistory.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    Users.remove(socket.userId);
    io.emit('update userlist', Users.list());
  });
}

function pushToChatHistory(message) {
  if (chatHistory.length === 100) {
    chatHistory.pop();
  }
  chatHistory.unshift(message);
}

module.exports = sockets;
