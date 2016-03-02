'use strict';

const toId = require('toid');
const db = require('./db');
const ranks = require('./config').ranks;

let users = {};

class User {
  constructor(name, socket) {
    this.name = name;
    this.userId = toId(name);
    this.socket = socket;
    this.ip = socket.request.headers['x-forwarded-for'] ||
              socket.request.connection.remoteAddress;
    this.isNamed = false;
    this.isRegistered = false;
    this.lastMessage = '';
    this.lastMessageTime = 0;
    this.rank = db('ranks').get(this.userId, 0);
    this.rankDisplay = ranks[this.rank];
  }

  setName(name) {
    delete users[this.userId];
    this.name = name;
    this.userId = toId(name);
    this.socket.userId = this.userId;
    this.isNamed = true;
    users[this.userId] = this;
  }

  setRank(rank) {
    this.rank = rank;
    this.rankDisplay = ranks[rank];
    db('ranks').set(this.userId, rank);
  }
}

function createUser(name, socket) {
  const user = new User(name, socket);
  users[user.userId] = user;
  return user.userId;
}

function getUser(name) {
  return users[toId(name)];
}

function listUsers() {
  return Object.keys(users)
    .map(name => {
      const user = users[name];
      return {
        name: user.name,
        rank: user.rank,
        rankDisplay: user.rankDisplay
      };
    });
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
