'use strict';

const _ = require('lodash');
const Users = require('./users');
const toId = require('../common/toId');
const parser = require('./parser');

let chatHistory = [];

function sockets(io) {
  io.on('connection', (socket) => {
    connection(io, socket);
  });
}

function connection(io, socket) {
  /**
   * Add user to chat userlist event.
   *
   * @params {String} username
   */

  socket.on('add user', (username) => {
    if (!_.isString(username)) return;

    const userId = toId(username);
    if (!userId || userId.length > 19) return;

    if (socket.userId === userId) {
      Users.get(socket.userId).setName(username);
      return io.emit('update userlist', Users.list());
    }

    if (Users.get(userId)) return;

    if (!socket.userId) {
      socket.userId = Users.create(username, socket);
    } else {
      Users.get(socket.userId).setName(username);
    }

    io.emit('update userlist', Users.list());
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
