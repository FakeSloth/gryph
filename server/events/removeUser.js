'use strict';

const Users = require('../users');

function removeUser(io, socket) {
  Users.remove(socket.userId);
  delete socket.userId;
  io.emit('update userlist', Users.list());
}

module.exports = removeUser;
