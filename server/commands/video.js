/*eslint no-unused-vars: 0*/
'use strict';

const moment = require('moment');

module.exports = {
  skip(target, room, user) {
    if (!this.isRank('admin')) return;
    room.skipVideo(user.name, target);
  },

  viewqueue: 'queue',
  queue(target, room, user) {
    let buf = '';
    room.eachVideoInQueue((video, index) => {
      const duration = moment.duration(video.duration).humanize();
      buf += `${index+1}. ${video.host} - ${duration}<br>`;
    });
    this.sendHtml(buf);
  }
};
