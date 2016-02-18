'use strict';

const _ = require('lodash/fp');
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
  return _.get(toId(name), users);
}

function list() {
  return _.flow(_.values, _.map('name'))(users);
}

function remove(name) {
  users = _.unset(toId(name), users);
}

const Users = {
  add,
  get: get,
  list,
  remove
};

module.exports = Users;
