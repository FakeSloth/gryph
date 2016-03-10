'use strict';

const toId = require('toid');
const db = require('./db');
const ranks = require('./config').ranks;
const _ = require('lodash');

let users = {};
let mutedUsers = {};
let vidLockUsers = {};

class User {
  constructor(name, socket) {
    this.name = name;
    this.userId = toId(name);
    this.socket = socket;
    this.ip = socket.request.headers['x-forwarded-for'] ||
              socket.request.connection.remoteAddress;

    this.isMuted = mutedUsers[this.ip] ? true : false;
    this.isNamed = false;
    this.isRegistered = false;
    this.isVideoLocked = vidLockUsers[this.ip] ? true : false;

    this.muteTimeout = mutedUsers[this.ip] ? mutedUsers[this.ip] : null;

    this.lastMessage = '';
    this.lastMessageTime = 0;

    this.rank = db('ranks').get(this.userId, 0);
    this.rankDisplay = ranks[this.rank];

    this.previousVideos = [];
    this.playlist = [];
  }

  mute(ms) {
    this.isMuted = true;
    this.muteTimeout = setTimeout(this.unmute.bind(this), ms);
    mutedUsers[this.ip] = this.muteTimeout;
  }

  unmute(emitExpired) {
    this.isMuted = false;
    delete mutedUsers[this.ip];
    if (!emitExpired) {
      this.socket.emit('chat message', {text: 'Your mute has expired.'});
    }
  }

  vidLock() {
    this.isVideoLocked = true;
    vidLockUsers[this.ip] = true;
  }

  unvidLock() {
    this.isVideoLocked = false;
    delete vidLockUsers[this.ip];
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

  updatePlaylist(playlist) {
    if (!playlist) {
      this.playlist = [];
      return;
    } else if (!this.playlist.length && playlist === true) {
      return false;
    } else if (!this.playlist.length) {
      this.playlist = playlist;
    }

    let randIndex = _.random(0, this.playlist.length - 1);
    let videoId = this.playlist[randIndex].url.split('=')[1];
    while (this.previousVideos.indexOf(videoId) >= 0 && this.playlist.length) {
      this.playlist.splice(randIndex, 1);
      randIndex = _.random(0, this.playlist.length - 1);
      videoId = this.playlist[randIndex].url.split('=')[1];
    }
    let duration = this.playlist[randIndex].ms;
    this.previousVideos.push(videoId);
    this.playlist.splice(randIndex, 1);
    return {videoId, duration};
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
