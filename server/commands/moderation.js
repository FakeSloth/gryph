'use strict';

const Users = require('../users');
const toId = require('toid');

module.exports = {
  mute(target, room, user) {
    if (!this.isRank('mod')) return;
    if (!target) return this.sendReply('/mute [username], [reason] - Mutes a user for 10 minutes.');
    const parts = target.split(',');
    const targetUser = Users.get(toId(parts[0]));
    if (!targetUser) return this.errorReply(`User ${parts[0]} not found.`);
    if (targetUser.isMuted) return this.errorReply(`User ${parts[0]} is already muted.`);
    if (targetUser.rank > user.rank) return this.errorReply('You do not have enough authority to mute this user.');
    targetUser.mute(600000);
    const reason = parts[1] ? ` (${parts[1]}).` : '.';
    room.add(`${targetUser.name} was muted by ${user.name} for 10 minutes${reason}`);
  },

  unmute(target, room, user) {
    if (!this.isRank('mod')) return;
    if (!target) return this.sendReply('/unmute [username] - Removes mute from user.');
    const targetUser = Users.get(toId(target));
    if (!targetUser) return this.errorReply(`User ${target} not found.`);
    if (!targetUser.isMuted) return this.errorReply(`User ${target} is not muted.`);
    clearTimeout(targetUser.muteTimeout);
    targetUser.unmute(true);
    room.add(`${targetUser.name} was unmuted by ${user.name}.`);
  }
};
