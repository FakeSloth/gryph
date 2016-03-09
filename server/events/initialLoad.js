'use strict';

const Users = require('../users');
const db = require('../db');

function initialLoad(socket, socketStore) {
  socket.emit('update messages', socketStore.chatHistory);
  socket.emit('update userlist', Users.list());
  socket.emit('update playlists', db('playlists').get(socket.userId), {});
  if (socketStore.isPlaying) {
    socket.emit('next video', socketStore.currentVideo);
  }
}

module.exports = initialLoad;
