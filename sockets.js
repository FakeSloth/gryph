'use strict';

const Deque = require('double-ended-queue');
const got = require('got');
const moment = require('moment');

const config = require('./config');
const utils = require('./utils');
const parser = require('./parser');

let users = {};
let history = [];
let videos = new Deque();

let isPlaying = false;
let currentVideo = {id: '', start: 0};

function sockets(io) {
  io.on('connection', (socket) => {
    /**
    * On initial connect.
    */

    socket.emit('chat history', {users: getUsernames(), history: history});

    if (isPlaying) {
      socket.emit('start video', currentVideo);
    }

    /**
    * Main events.
    */

    // @param username :: String
    socket.on('add user', (username) => {
      const userid = utils.toId(username);
      if (!userid || userid.length > 19) return;
      if (socket.user && username !== socket.user.username && userid === socket.user.userid) {
        users[userid] = {userid: userid, username: username, ip: socket.handshake.address};
        socket.user = users[userid];
        io.emit('update users', getUsernames());
        return;
      }
      if (users[userid]) return;
      if (socket.user && socket.user.userid) {
        delete users[socket.user.userid];
      }
      users[userid] = {userid: userid, username: username, ip: socket.handshake.address};
      socket.user = users[userid];
      io.emit('update users', getUsernames());
    });

    // @param videoId :: String
    socket.on('add video', (videoId) => {
      videos.push(videoId);
      nextVideo(io, socket);
    });

    // @param data :: Object {message: String, username(Optional): String}
    socket.on('chat message', (data) => {
      if (data.message.length > 300) return;
      if (typeof data === 'object' && data.hasOwnProperty('username')) {
        const markup = {__html: parser(data.message)};
        data = {username: data.username, message: markup};
      }
      history.push(data);
      io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
      if (socket.user) delete users[socket.user.userid];
      io.emit('update users', getUsernames());
    });
  });
}

function getDuration(id) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + config.googleAPIKey + '&part=snippet,contentDetails';
    got(url)
      .then(response => {
        const json = JSON.parse(response.body);
        if (!json.items.length) return reject();
        const time = json.items[0].contentDetails.duration;
        resolve(moment.duration(time).asMilliseconds());
      })
      .catch(error => console.log(error.response.body));
  });
}

function getUsernames() {
  return Object.keys(users).map(userid => users[userid].username);
}

/**
 * Recursively calls next video as long as videos queue is not empty
 * using setTimeout.
 */

function nextVideo(io, socket) {
  if (isPlaying) return;
  if (videos.isEmpty()) {
    isPlaying = false;
    io.emit('next video', '');
    return;
  }
  const videoid = videos.shift();
  getDuration(videoid)
    .then(duration => {
      // 10 minute limit
      if (duration > 600000) {
        socket.emit('chat message', {message: 'Video is too long. The limit is 10 minutes.'});
        return nextVideo(io, socket);
      }
      isPlaying = true;
      currentVideo = {id: videoid, start: Date.now()};
      setTimeout(() => {
        isPlaying = false;
        nextVideo(io, socket);
      }, duration);
      io.emit('next video', currentVideo);
    })
    .catch(() => {
      socket.emit('chat message', {message: 'Invalid video url.'});
    });
}

module.exports = sockets;
