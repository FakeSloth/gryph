/*eslint no-unused-vars: 0*/
'use strct';

const Users = require('./users');
const toId = require('toid');
const escapeHtml = require('./escapeHtml');
const hashColor = require('../hashColor');
const moment = require('moment');

module.exports = {
  hello(target, room, user) {
    this.sendReply(`Hello ${user.name}! You put ${target}.`);
  },

  me(target, room, user) {
    const dot = `<strong style='color: ${hashColor(user.userId)}'>•</strong>`;
    room.addHtml(`${dot} ${user.name} <em>${escapeHtml(target)}</em>`);
  },

  declare(target, room, user) {
    if (!this.isRank('admin')) return;
    room.addHtml(`<div class='declare'>${escapeHtml(target)}</div>`);
  },

  wall: 'announce',
  announce(target, room, user) {
    if (!this.isRank('mod')) return;
    const strong = `<strong style='color: ${hashColor(user.userId)}'>${user.name}:</strong>`;
    const announcment = `<text class="announce">${escapeHtml(target)}</text>`;
    room.addHtml(`${strong} ${announcment}`);
  },

  staff(target, room, user) {
    if (!this.isRank('staff')) return;
    if (!target) return this.sendReply('/staff [user] - Change a user\'s rank to staff.');
    room.rankUser(target, 5, 'Staff');
  },

  admin(target, room, user) {
    if (!this.isRank('staff')) return;
    if (!target) return this.sendReply('/admin [user] - Change a user\'s rank to admin.');
    room.rankUser(target, 4, 'Adminstrator');
  },

  globalmod: 'gmod',
  gmod(target, room, user) {
    if (!this.isRank('admin')) return;
    if (!target) return this.sendReply('/gmod [user] - Change a user\'s rank to global moderator.');
    room.rankUser(target, 3, 'Global Moderator');
  },

  moderator: 'mod',
  mod(target, room, user) {
    if (!this.isRank('admin')) return;
    if (!target) return this.sendReply('/mod [user] - Change a user\'s rank to moderator.');
    room.rankUser(target, 2, 'Moderator');
  },

  voice(target, room, user) {
    if (!this.isRank('gmod')) return;
    if (!target) return this.sendReply('/voice [user] - Change a user\'s rank to voice.');
    room.rankUser(target, 1, 'Voice');
  },

  reg(target, room, user) {
    if (!this.isRank('gmod')) return;
    if (!target) return this.sendReply('/reg [user] - Change a user\'s rank to a regular user.');
    room.rankUser(target, 0, 'Regular User');
  },

  ip(target, room, user) {
    if (!this.isRank('gmod')) return;
    if (!target) target = user.userId;
    const targetUser = Users.get(toId(target));
    if (!targetUser) return this.errorReply('This user is not online.');
    this.sendReply(targetUser.name + '\'s ip is ${targetUser.ip}.');
  },

  skip(target, room, user) {
    if (!this.isRank('admin')) return;
    room.skipVideo(user.name);
  },

  viewqueue: 'queue',
  queue(target, room, user) {
    room.eachVideoInQueue((video, index) => {
      const duration = moment.duration(video.duration).humanize();
      this.sendReply(`${index+1}. ${video.host} - ${duration}`);
    });
  },

  clear(target, room, user) {
    this.clearChat();
  }
};
