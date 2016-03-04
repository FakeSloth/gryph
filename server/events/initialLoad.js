'use strict';

const Users = require('../users');

function initialLoad(socket, socketStore) {
  socket.emit('update messages', socketStore.chatHistory);
  socket.emit('update userlist', Users.list());
  if (socketStore.isPlaying) {
    socket.emit('next video', socketStore.currentVideo);
  }
}

module.exports = initialLoad;
