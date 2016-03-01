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
  }
};
