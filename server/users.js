'use strict';

const toId = require('../toId');

let users = {};

function User(name, socket) {
  this.name = name;
  this.userId = toId(name);
  this.socket = socket;
  this.ip = socket.request.connection.remoteAddress;
  this.isNamed = false;
}

User.prototype.setName = function(name) {
  delete users[this.userId];
  this.name = name;
  this.userId = toId(name);
  this.socket.userId = this.userId;
  this.isNamed = true;
  users[this.userId] = this;
};


function createUser(name, socket) {
  const user = new User(name, socket);
  users[user.userId] = user;
  return user.userId;
}

function getUser(name) {
  return users[toId(name)];
}

function listUsers() {
  return Object.keys(users).map(name => users[name].name);
}

function removeUser(name) {
  delete users[toId(name)];
}

const Users = {
  create: createUser,
  get: getUser,
  list: listUsers,
  remove: removeUser
};

module.exports = Users;
