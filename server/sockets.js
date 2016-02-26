'use strict';

const _ = require('lodash');
const Users = require('./users');
const toId = require('../common/toId');
const parser = require('./parser');
const config = require('./config');
const db = require('./db');
const jwt = require('jsonwebtoken');
const got = require('got');
const moment = require('moment');

let chatHistory = [];
let isPlaying = false;
let videoQueue = [];
let videoQueueIps = {};

function sockets(io) {
  io.on('connection', (socket) => {
    connection(io, socket);
  });
}

function connection(io, socket) {
   socket.emit('update messages', chatHistory);
   socket.emit('update userlist', Users.list());

   function handleAddUser(username) {
     if (!socket.userId) {
       socket.userId = Users.create(username, socket);
     } else {
       Users.get(socket.userId).setName(username);
     }

     io.emit('update userlist', Users.list());
   }

  socket.on('add user', (data) => {
    if (!_.isObject(data) || (_.isObject(data) && !data.name)) return;
    const username = data.name;
    const userId = toId(username);
    if (!userId || userId.length > 19) return;

    if (socket.userId === userId) {
      Users.get(socket.userId).setName(username);
      return io.emit('update userlist', Users.list());
    }

    if (Users.get(userId)) return;

    if (db('users').has(userId)) {
      if (!data.token) return;
      jwt.verify(data.token, config.jwtSecret, (err, decoded) => {
        if (err) return;
        if (decoded.userId !== userId) return;
        handleAddUser(username);
      });
    } else {
      handleAddUser(username);
    }
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

  socket.on('add video', (videoId) => {
    if (!_.isString(videoId)) return;
    if (!videoId || videoId.length > 300) return;
    if (!socket.userId) return;
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
      videoQueue.unshift({videoId, host: user.name, ip: user.ip, duration: ms});
      //videoQueueIps[user.ip] = true;
      console.log(videoQueue)
      socket.emit('chat message', {
        text: 'Video added to the queue.',
        className: 'text-success'
      });
      if (!isPlaying) {
        isPlaying = true;
        nextVideo((video) => io.emit('next video', video));
      }
    }).catch(error => console.log(error.response.body));
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

function nextVideo(emitVideo) {
  const video = videoQueue.pop();
  delete videoQueueIps[video.ip];
  emitVideo({videoId: video.videoId, host: video.host, start: Date.now()});
  setTimeout(() => {
    if (videoQueue.length) {
      nextVideo(emitVideo);
    } else {
      resetVideo(emitVideo);
    }
  }, video.duration);
}

function resetVideo(emitVideo) {
  isPlaying = false;
  emitVideo({videoId: '', host: '', start: 0});
}

module.exports = sockets;
