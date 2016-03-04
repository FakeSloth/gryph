'use strict';

const _ = require('lodash');
const Users = require('../users');
const config = require('../config');
const toId = require('toid');

function createCommandsAPI(io, socket, socketStore) {
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
      socketStore.pushToChatHistory(message);
      io.emit('chat message', message);
    },
    addHtml(text) {
      const message = {text, html: true};
      socketStore.pushToChatHistory(message);
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
    skipVideo(name, target) {
      const reason = target ? ` (${target.trim()})` : '';
      if (!socketStore.isPlaying) return context.errorReply('No video is playing.');
      io.emit('chat message', {
        text: socketStore.currentVideo.host  + '\'s video skipped by ' + name + '.' + reason
      });
      clearTimeout(socketStore.timeout);
      socketStore.resumeVideoQueue();
    },
    eachVideoInQueue(cb) {
      const videoQueue = socketStore.videoQueue;
      if (!videoQueue.length) return context.errorReply('Video queue is empty.');
      _(videoQueue.slice().reverse()).forEach(cb);
    }
  };

  return {context, room};
}

module.exports = createCommandsAPI;
