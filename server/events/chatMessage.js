'use strict';

const _ = require('lodash');
const Users = require('../users');
const toId = require('toid');

function chatMessage(io, socket, socketStore, parser, msg) {
  if (!_.isObject(msg)) return;
  if (!_.isString(msg.username) || !_.isString(msg.text)) return;
  if (!msg.username || !msg.text || msg.html) return;
  if (!socket.userId || toId(msg.username) !== socket.userId) return;
  const user = Users.get(socket.userId);
  const message = parser(msg.text, user);
  if (!message) return;
  socketStore.pushToChatHistory(message);
  io.emit('chat message', message);
}

module.exports = chatMessage;
