'use strct';

const escapeHtml = require('./escapeHtml');
const hashColor = require('../client/hashColor');

module.exports = {
  hello(target, user) {
    this.sendReply('Hello ' + user.name + '! You put ' + target + '.');
  },

  me(target, user) {
    const dot = '<strong style="color:' + hashColor(user.userId) + '" >•</strong>';
    this.add(dot + ' ' + user.name + ' <em>' + escapeHtml(target) + '</em>');
  }
};
