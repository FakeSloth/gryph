'use strict';

const Users = require('../users');
const isObject = require('lodash/isObject');

function selectPlaylist(socket, socketStore, playlist) {
  if (!socket.userId) return;
  if (!playlist || (isObject(playlist) && !Object.keys(playlist).length)) {
    return Users.get(socket.userId).updatePlaylist();
  }

  const user = Users.get(socket.userId);

  if (socketStore.videoQueueIps[user.ip]) {
    return socket.emit('chat message', {
      text: 'You already have a video in the queue.',
      className: 'text-danger'
    });
  }

  const video = user.updatePlaylist(playlist);

  socketStore.videoQueue.unshift({
    videoId: video.videoId,
    host: user.name,
    ip: user.ip,
    duration: video.duration,
    inPlaylist: true
  });
  socketStore.videoQueueIps[user.ip] = true;
  if (!socketStore.isPlaying) {
    socketStore.isPlaying = true;
    socketStore.nextVideo();
  }
}

module.exports = selectPlaylist;
