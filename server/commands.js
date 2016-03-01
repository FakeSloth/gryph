/*eslint no-unused-vars: 0*/
'use strct';

const escapeHtml = require('./escapeHtml');
const hashColor = require('../hashColor');

module.exports = {
  hello(target, room, user) {
    this.sendReply(`Hello ${user.name}! You put ${target}.`);
  },

  me(target, room, user) {
    const dot = `<strong style='color: ${hashColor(user.userId)}'>•</strong>`;
    room.addHtml(`${dot} ${user.name} <em>${escapeHtml(target)}</em>`);
  },

  staff(target, room, user) {
    if (!this.isRank('staff')) return;
    if (!target) return this.sendReply('/staff [user] - Promote a user to staff.');
    room.rankUser(target, 5, 'Staff');
  },

  admin(target, room, user) {
    if (!this.isRank('staff')) return;
    if (!target) return this.sendReply('/admin [user] - Promote a user to admin.');
    room.rankUser(target, 4, 'Adminstrator');
  },

  globalmod: 'gmod',
  gmod(target, room, user) {
    if (!this.isRank('admin')) return;
    if (!target) return this.sendReply('/gmod [user] - Promote a user to global moderator.');
    room.rankUser(target, 3, 'Global Moderator');
  },

  moderator: 'mod',
  mod(target, room, user) {
    if (!this.isRank('admin')) return;
    if (!target) return this.sendReply('/mod [user] - Promote a user to moderator.');
    room.rankUser(target, 2, 'Moderator');
  },

  voice(target, room, user) {
    if (!this.isRank('gmod')) return;
    if (!target) return this.sendReply('/voice [user] - Promote a user to voice.');
    room.rankUser(target, 1, 'Voice');
  }
};
