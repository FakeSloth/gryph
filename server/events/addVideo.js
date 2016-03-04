'use strict';

const _ = require('lodash');
const Users = require('../users');
const config = require('../config');
const got = require('got');
const moment = require('moment');
const winston = require('winston');

function addVideo(socket, socketStore, data) {
  if (!_.isString(data)) return;
  if (!data || data.length > 300) return;
  if (!socket.userId) return;
  const videoId = validateVideo(data);
  if (!videoId) return;
  const user = Users.get(socket.userId);
  if (socketStore.videoQueueIps[user.ip]) {
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
    socketStore.videoQueue.unshift({
      videoId,
      host: user.name,
      ip: user.ip,
      duration: ms
    });
    socketStore.videoQueueIps[user.ip] = true;
    socket.emit('chat message', {
      text: 'Video added to the queue.',
      className: 'text-success'
    });
    if (!socketStore.isPlaying) {
      socketStore.isPlaying = true;
      socketStore.nextVideo();
    }
  }).catch(error => winston.error(error.response.body));
}

function validateVideo(data) {
  const parts = data.split('=');
  if (parts.length < 2) return;
  if (parts[1].indexOf('&') >= 0) parts[1] = parts[1].split('&')[0];
  const videoId = parts[1].trim();
  if (!videoId) return;
  return videoId;
}

module.exports = addVideo;
