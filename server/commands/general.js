/*eslint no-unused-vars: 0*/
'use strict';

const Users = require('../users');
const toId = require('toid');
const escapeHtml = require('../escapeHtml');
const hashColor = require('../../hashColor');
const _ = require('lodash');
const db = require('./../db');
const ranks = require('../config').rankNames;

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
    this.sendReply(targetUser.name + '\'s ip is ' + targetUser.ip + '.');
  },

  clear(target, room, user) {
    this.clearChat();
  },

  github: 'git',
  git(target, room, user) {
    const gitUrl = '<a href=https://github.com/FakeSloth/gryph> Github Repository!</a>';
    this.sendHtml(`Gryph is open source! Check out our ${gitUrl}`);
  },

  credit: 'credits',
  credits(target, room, user) {
    this.sendHtml(`<br>Gryph is brought to you by the following people:\n
      - CreaturePhil - Design and Development\n
      - fender - Development</br>`);
  },

  auth(target, room, user) {
    const allRanks = db('ranks').object();
    let rankNames = _.invert(ranks);
    let rankLists = {};
    _.forIn(allRanks, function(value, key) {
      if (!rankLists[rankNames[value]]) rankLists[rankNames[value]] = [];
      if (allRanks[key] === value) {
        const arr = rankLists[rankNames[value]];
        arr.push(`<b><font color="${hashColor(key)}">${key}</font></b>`);
      }
    });
    let buffer = _.keys(rankLists).sort((a, b) => ranks[a] < ranks[b])
      .map(r =>
        (ranks[r] ? r + 's (' + r + ')' : r) + ':<br />' + rankLists[r].join(', ')
      );
    if (!buffer.length) buffer = 'No authority present.';
    this.sendHtml(`
      <div class='text-center welcome'>Gryph Authority List:<br /><br />
      ${buffer.join('<br /><br />')}</div>
    `);
  },

  'memusage': 'memoryusage',
  memoryusage: function (target) {
    if (!this.isRank('staff')) return;
    let memUsage = process.memoryUsage();
    let results = [memUsage.rss, memUsage.heapUsed, memUsage.heapTotal];
    let units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    for (let i = 0; i < results.length; i++) {
      let unitIndex = Math.floor(Math.log2(results[i]) / 10); // 2^10 base log
      results[i] = '' + (results[i] / Math.pow(2, 10 * unitIndex)).toFixed(2) + ' ' + units[unitIndex];
    }
    this.sendReply('Main process. RSS: ' + results[0] + '. Heap: ' + results[1] + ' / ' + results[2] + '.');
  },

  help: 'commandlist',
  commands: 'commandlist',
  cmdlist: 'commandlist',
  commandlist(target, room, user) {
    let cmdlist = `- /queue: Shows the order for songs to be played.<br>
      - /ranks OR /staff: Explanation of the staff and moderator groups.<br>
      - /me: Say a message in the third person.<br>
      - /git: Links to the project github repository.<br>
      - /credits: Credits the Gryph development team.<br>`;
    if (!this.isRank('mod', true)) {
      this.sendHtml(cmdlist);
      return;
    } else {
      cmdlist += `- /declare: Declare a large message. Used for making announcments.<br>
      - /announce or /wall: Highlight and important message in blue.<br>
      - /skip: Skips to the next video in the cue.<br>
      - /ip: Displays the ip address of a target user.<br>
      - Promotion: /[rank] Promotes a user to a target rank.`;
      this.sendHtml(cmdlist);
    }
  }
};
