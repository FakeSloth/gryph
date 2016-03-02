'use strict';

const _ = require('lodash');
const Users = require('./users');
const toId = require('toid');
const parser = require('./parser');
const config = require('./config');
const db = require('./db');
const jwt = require('jsonwebtoken');
const got = require('got');
const moment = require('moment');
const winston = require('winston');

let timeout;
let chatHistory = db('chat').get('lobby', []);
let isPlaying = false;
let videoQueue = [];
let videoQueueIps = {};
let currentVideo = {videoId: '', host: '', start: 0};

function sockets(io) {
  io.on('connection', (socket) => {
    connection(io, socket);
  });
}

function connection(io, socket) {
  const context = {
    sendReply(text) {
      socket.emit('chat message', {text});
    },
    errorReply(text) {
      socket.emit('chat message', {text, className: 'text-danger'});
    },
    sendHtml(text) {
      socket.emit('chat message', {text, html: true});
    },
    isRank(rank, isNoReply) {
      if (Users.get(socket.userId).rank < config.rankNames[toId(rank)]) {
        if (!isNoReply) this.errorReply('Access Denied.');
        return false;
      }
      return true;
    },
    clearChat() {
      socket.emit('update messages', []);
    }
  };

  const room = {
    add(text) {
      const message = {text};
      pushToChatHistory(message);
      io.emit('chat message', message);
    },
    addHtml(text) {
      const message = {text, html: true};
      pushToChatHistory(message);
      io.emit('chat message', message);
    },
    rankUser(name, rank, rankName) {
      const user = Users.get(toId(name));
      if (!user) {
        return context.errorReply('A user must be online to be promoted or demoted.');
      } else if (!user.isRegistered) {
        return context.errorReply('A user must be registered to be promoted or demoted.');
      } else if (user.rank > Users.get(socket.userId).rank) {
        return context.errorReply('You cannot change the rank of user higher than you.');
      } else if (user.rank === rank) {
        return context.errorReply('This user is already this rank.');
      }
      const move = user.rank < rank ? 'promoted' : 'demoted';
      user.setRank(rank);
      io.emit('chat message', {text: `${name} was ${move} to ${rankName} by ${Users.get(socket.userId).name}.`});
      io.emit('update userlist', Users.list());
    },
    skipVideo(name) {
      if (!isPlaying) return context.errorReply('No video is playing.');
      io.emit('chat message', {text: `${currentVideo.host}'s video skipped by ${name}.`});
      clearTimeout(timeout);
      const emitter = (video) => io.emit('next video', video);
      if (videoQueue.length) {
        nextVideo(emitter);
      } else {
        resetVideo(emitter);
      }
    },
    eachVideoInQueue(cb) {
      if (!videoQueue.length) return context.errorReply('Video queue is empty.');
      _(videoQueue.slice().reverse()).forEach(cb);
    }
  };

  function handleAddUser(username, isRegistered) {
    if (!socket.userId || !Users.get(socket.userId)) {
      socket.userId = Users.create(username, socket);
    } else {
      Users.get(socket.userId).setName(username);
    }

    if (isRegistered) {
      Users.get(socket.userId).isRegistered = true;
    }

    io.emit('update userlist', Users.list());
  }

  socket.on('initial load', () => {
    socket.emit('update messages', chatHistory);
    socket.emit('update userlist', Users.list());
    if (isPlaying) socket.emit('next video', currentVideo);
  });

  socket.on('add user', (data) => {
    if (!_.isObject(data) || (_.isObject(data) && !data.name)) return;
    const username = data.name;
    const userId = toId(username);
    if (!userId || userId.length > 19) return;

    if (socket.userId === userId) {
      if (db('users').get(userId) && data.token) {
        return jwt.verify(data.token, config.jwtSecret, (err) => {
          if (err) return socket.emit('error token');
          handleAddUser(username, true);
        });
      }
      return handleAddUser(username);
    }

    if (Users.get(userId)) return;

    if (db('users').get(userId)) {
      if (!data.token) return;
      jwt.verify(data.token, config.jwtSecret, (err, decoded) => {
        if (err) return socket.emit('error token');
        if (decoded.userId !== userId) return;
        handleAddUser(username, true);
      });
    } else {
      handleAddUser(username);
    }
  });

  socket.on('chat message', (msg) => {
    if (!_.isObject(msg)) return;
    if (!_.isString(msg.username) || !_.isString(msg.text)) return;
    if (!msg.username || !msg.text || msg.html) return;
    if (!socket.userId || toId(msg.username) !== socket.userId) return;
    const user = Users.get(socket.userId);
    const message = parser(msg.text, user, context, room);
    if (!message) return;
    pushToChatHistory(message);
    io.emit('chat message', message);
  });

  socket.on('add video', (data) => {
    if (!_.isString(data)) return;
    if (!data || data.length > 300) return;
    if (!socket.userId) return;
    const videoId = validateVideo(data);
    if (!videoId) return;
    const user = Users.get(socket.userId);
    if (videoQueueIps[user.ip]) {
      return socket.emit('chat message', {
        text: 'You already have a video in the queue.',
        className: 'text-danger'
      });
    }
    const url = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + config.googleAPIKey + '&part=snippet,contentDetails';
    got(url).then(response => {
      const json = JSON.parse(response.body);
      if (!json.items.length) {
        return socket.emit('chat message', {
          text: 'This video does not exist.',
          className: 'text-danger'
        });
      }
      const duration = json.items[0].contentDetails.duration;
      const ms = moment.duration(duration).asMilliseconds();
      if (ms > config.videoLimit && user.rank < 4) {
        return socket.emit('chat message', {
          text: 'Video is too long. The limit is 10 minutes.',
          className: 'text-danger'
        });
      }
      videoQueue.unshift({videoId, host: user.name, ip: user.ip, duration: ms});
      videoQueueIps[user.ip] = true;
      socket.emit('chat message', {
        text: 'Video added to the queue.',
        className: 'text-success'
      });
      if (!isPlaying) {
        isPlaying = true;
        nextVideo((video) => io.emit('next video', video));
      }
    }).catch(error => winston.error(error.response.body));
  });

  function removeUser() {
    Users.remove(socket.userId);
    delete socket.userId;
    io.emit('update userlist', Users.list());
  }

  socket.on('logout', removeUser);
  socket.on('disconnect', removeUser);
}

function pushToChatHistory(message) {
  if (chatHistory.length === 100) {
    chatHistory.shift();
  }
  chatHistory.push(message);
  db('chat').set('lobby', chatHistory);
}

function nextVideo(emitVideo) {
  const video = videoQueue.pop();
  delete videoQueueIps[video.ip];
  currentVideo = {videoId: video.videoId, host: video.host, start: Date.now()};
  emitVideo(currentVideo);
  timeout = setTimeout(() => {
    if (videoQueue.length) {
      nextVideo(emitVideo);
    } else {
      resetVideo(emitVideo);
    }
  }, video.duration);
}

function resetVideo(emitVideo) {
  isPlaying = false;
  currentVideo = {videoId: '', host: '', start: 0};
  emitVideo(currentVideo);
}

function validateVideo(data) {
  const parts = data.split('=');
  if (parts.length < 2) return;
  if (parts[1].indexOf('&') >= 0) parts[1] = parts[1].split('&')[0];
  const videoId = parts[1].trim();
  if (!videoId) return;
  return videoId;
}

module.exports = sockets;
