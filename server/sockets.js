'use strict';

const _ = require('lodash');
const Users = require('./users');
const toId = require('../common/toId');

let chatHistory = [];

function sockets(io) {
  io.on('connection', (socket) => {
    connection(io, socket);
  });
}

function connection(io, socket) {
  if (!socket.userid) {
    socket.userid = Users.add(socket);
  }

  /**
   * Add user to chat userlist event.
   *
   * @params {String} username
   */

   // NOTE TO SELF! REMOVE UNNCESSARY RESPONSES! JUST RETURN BUT RETURN AN ERROR ON THE CLIENT
  socket.on('add user', (username) => {
    if (!_.isString(username)) return;

    const userid = toId(username);
    if (!userid || userid.length > 19 || userid.substr(0, 5) === 'guest') return;

    if (socket.userid === userid) {
      Users.get(userid).username = username;
      return io.emit('update users', Users.list());
    }

    if (Users.get(userid)) return;

    socket.userid = userid;
    Users.get(userid).username = username;
    Users.get(userid).userid = userid;
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

    if (_.has(msg, 'username')) {
      const markup = {__html: parser(msg.text)};
      data = {username: msg.username, text: markup};
    }
    pushToChatHistory(msg)
    chatHistory.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    Users.remove(socket.userid);
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
