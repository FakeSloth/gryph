'use strict';

const Parser = require('./parser');
const Users = require('./users');
const config = require('./config');
const createCommandsAPI = require('./commands');
const db = require('./db');
const toId = require('toid');

const addUser = require('./events/addUser');
const addVideo = require('./events/addVideo');
const chatMessage = require('./events/chatMessage');
const initialLoad = require('./events/initialLoad');
const removeUser = require('./events/removeUser');
const selectPlaylist = require('./events/selectPlaylist');

let socketStore = {
  chatHistory: db('chat').get('lobby', []),
  currentVideo: {videoId: '', host: '', start: 0},
  isPlaying: false,
  timeout: null,
  videoQueue: [],
  videoQueueIps: {},

  emitVideo(io, video) {
    io.emit('next video', video);
  },

  nextVideo() {
    const video = this.videoQueue.pop();
    delete this.videoQueueIps[video.ip];
    if (video.inPlaylist) {
      const user = Users.get(toId(video.host));
      const nextVid = user.updatePlaylist(true);
      if (nextVid && (nextVid.duration < config.videoLimit || user.rank >= 4)) {
        this.videoQueue.unshift({
          videoId: nextVid.videoId,
          host: user.name,
          ip: user.ip,
          duration: nextVid.duration,
          inPlaylist: true
        });
        this.videoQueueIps[user.ip] = true;
      }
    }
    this.currentVideo = {
      videoId: video.videoId,
      host: video.host,
      start: Date.now()
    };
    this.emitVideo(this.currentVideo);
    this.timeout = setTimeout(() => this.resumeVideoQueue(), video.duration);
  },

  pushToChatHistory(message) {
    if (this.chatHistory.length === 100) {
      this.chatHistory.shift();
    }
    this.chatHistory.push(message);
    db('chat').set('lobby', this.chatHistory);
  },

  resetVideo(emitVideo) {
    this.isPlaying = false;
    this.currentVideo = {videoId: '', host: '', start: 0};
    this.emitVideo(this.currentVideo);
  },

  resumeVideoQueue() {
    if (this.videoQueue.length) {
      this.nextVideo();
    } else {
      this.resetVideo();
    }
  }
};

function sockets(io) {
  socketStore.emitVideo = socketStore.emitVideo.bind(null, io);

  io.on('connection', (socket) => {
    const commandsAPI = createCommandsAPI(io, socket, socketStore);
    const parser = Parser.bind(commandsAPI);

    socket.on('add user', addUser.bind(null, io, socket));
    socket.on('add video', addVideo.bind(null, socket, socketStore));
    socket.on('chat message', chatMessage.bind(null, io, socket, socketStore, parser));
    socket.on('disconnect', removeUser.bind(null, io, socket));
    socket.on('initial load', initialLoad.bind(null, socket, socketStore));
    socket.on('logout', removeUser.bind(null, io, socket));
    socket.on('select playlist', selectPlaylist.bind(null, socket, socketStore));
  });
}

module.exports = sockets;
