'use strict';

var i = 0;
const Deque = require('double-ended-queue');
const got = require('got');
const moment = require('moment');
const Db = require('origindb')('db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// MOVE THIS SHIT LATER
/**
 * Authetication helper functions.
 */

function createSalt() {
  return crypto.randomBytes(32).toString('hex');
}

function createHash(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 512, (err, key) => {
      if (err) return reject(err);

      const hash = key.toString('hex');
      resolve(hash);
    });
  });
}

function isValidPassword(password, salt, userHash) {
  return new Promise((resolve, reject) => {
    createHash(password, salt).then(hash => resolve(hash === userHash));
  });
}

const config = require('./config');
const utils = require('./utils');
const parser = require('./parser');

let users = {};
let numUsers = 0;
let chatHistory = new Deque(100);
let videoHistory = new Deque(100);
let videos = new Deque();

let isPlaying = false;
let currentVideo = {id: '', start: 0, username: ''};

function sockets(io) {

  io.on('connection', (socket) => {
    /**
    * On initial connect.
    */
    numUsers++;

    socket.emit('chat history', {users: getUsernames(), history: chatHistory.toArray()});
    socket.emit('video history', videoHistory.toArray());

    if (isPlaying) {
      socket.emit('start video', currentVideo);
    }

    /**
    * Main events.
    */

    // @param username :: String
    socket.on('add user', (username) => {
      const userid = utils.toId(username);
      if (!userid || userid.length > 19) return socket.emit('chat message', {message: 'Invalid username.', context: 'text-danger'});
      if (users[userid] && userid !== (socket.user && socket.user.userid)) return socket.emit('chat message', {message: 'Someone is already on this username.', context: 'text-danger'});
      if (socket.user && username !== socket.user.username && userid === socket.user.userid) {
        users[userid] = {userid: userid, username: username, ip: socket.handshake.address};
        socket.user = users[userid];
        io.emit('update users', getUsernames());
        return;
      }
      if (socket.user && socket.user.userid) {
        delete users[socket.user.userid];
      }
      users[userid] = {userid: userid, username: username, ip: socket.handshake.address};
      socket.user = users[userid];
      io.emit('update users', getUsernames());
    });

    // @param videoId :: String
    socket.on('add video', (videoId) => {
      const username = (socket.user && socket.user.username) || 'Guest ' + numUsers;
      videos.push({id: videoId, username});
      nextVideo(io, socket);
    });

    // @param data :: Object {message: String, username(Optional): String}
    socket.on('chat message', (data) => {
      if (data.message.length > 300) return;
      if (typeof data === 'object' && data.hasOwnProperty('username')) {
        const markup = {__html: parser(data.message)};
        data = {username: data.username, message: markup};
      }
      chatHistory.push(data);
      io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
      if (socket.user) delete users[socket.user.userid];
      io.emit('update users', getUsernames());
    });

    socket.on('register user', (data) => {
      // do some validation
      const username = data.username.trim();
      if (!username || !data.password) return socket.emit('chat message', {message: 'You must enter a usernname or password.', context: 'text-danger'});
      if (username.length > 19) return socket.emit('chat message', {message: 'Username cannot be longer than 19 characters.', context: 'text-danger'});
      const userid = utils.toId(username);
      if (Db('users').get(userid)) return socket.emit('chat message', {message: 'Someone has already registered this username.', context: 'text-danger'});
      const salt = createSalt();
      createHash(data.password, salt).then(hash => {
        const user = {
          userid,
          username,
          salt,
          hash
        };

        Db('users').set(userid, user);
        socket.emit('chat message', {message: 'You are register! Now try to login!', context: 'text-success'});
      });
    });

    socket.on('login user', (data) => {
      const username = data.username.trim();
      if (!username || !data.password) return socket.emit('chat message', {message: 'You must enter a usernname or password.', context: 'text-danger'});
      if (username.length > 19) return socket.emit('chat message', {message: 'Username cannot be longer than 19 characters.', context: 'text-danger'});
      const userid = utils.toId(username);
      if (!Db('users').get(userid)) return socket.emit('chat message', {message: 'This username is not registered.', context: 'text-danger'});
      const user = Db('users').get(userid);
      isValidPassword(data.password, user.salt, user.hash)
        .then(valid => {
          if (!valid) {
            socket.emit('chat message', {message: 'Invalid username or password.', context: 'text-danger'});
          } else {
            const token = jwt.sign(user, 'super secret');
            socket.emit('chat message', {message: 'u are logined!', context: 'text-success'});
            socket.emit('get token', token);
          }
        });
    });
    socket.on('token secret', (token) => {
      if (!token) console.log('no');
      jwt.verify(token, 'super secret', function(err, decoded) {
        if (err) {
          console.log(i++, 'no');
        } else {
          console.log(decoded);
          console.log(i++, 'yes');
        }
      });
    });
  });
}

function getYTVideoData(id) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + config.googleAPIKey + '&part=snippet,contentDetails';
    got(url)
      .then(response => {
        const json = JSON.parse(response.body);
        if (!json.items.length) return reject();
        resolve(json.items[0]);
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
    io.emit('next video', {id: '', start: 0, username: ''});
    return;
  }
  const video = videos.shift();
  const error = (msg) => ({message: msg, context: 'text-danger'});
  getYTVideoData(video.id)
    .then(data => {
      const duration = data.contentDetails.duration;
      const ms = moment.duration(duration).asMilliseconds();
      // 10 minute limit
      if (ms > 600000) {
        socket.emit('chat message', error('Video is too long. The limit is 10 minutes.'));
        return nextVideo(io, socket);
      }
      isPlaying = true;
      currentVideo = {id: video.id, start: Date.now(), username: video.username};
      setTimeout(() => {
        isPlaying = false;
        nextVideo(io, socket);
      }, ms);
      io.emit('next video', currentVideo);
      const seconds = moment.duration(duration).seconds();
      videoHistory.unshift({
        host: video.username,
        url: 'https://www.youtube.com/watch?v=' + video.id,
        title: data.snippet.title,
        img: data.snippet.thumbnails.default.url,
        duration: moment.duration(duration).minutes() + ':' + (seconds < 10 ? '0' + seconds : seconds),
        author: data.snippet.channelTitle,
        channel: 'https://youtube.com/channel/' + data.snippet.channelId + '/videos',
        publishedAt: moment(data.snippet.publishedAt).fromNow()
      });
      io.emit('video history', videoHistory.toArray());
    })
    .catch((err) => {
      console.error(err);
      socket.emit('chat message', error('Invalid video url.'));
    });
}

module.exports = sockets;
