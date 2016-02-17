'use strict';

const _ = require('lodash');
const toId = require('../common/toId');

let users = {};
let numUsers = 0;

function User(socket) {
  const name = 'Guest ' + (++numUsers);
  const userid = toId(name);

  return {
    socket,
    name,
    userid,
    ip: socket.request.connection.remoteAddress,
    isNamed: false
  };
}

function add(socket) {
  const user = new User(socket);
  users[user.userid] = user;
  return user.userid;
}

function get(name) {
  return _.get(users, toId(name));
}

function list() {
  return _.chain(users)
          .values()
          .map('name')
          .value();
}

function remove(userid) {
  _.unset(users, userid);
}

const Users = {
  add,
  get: get,
  list,
  remove
};

module.exports = Users;
