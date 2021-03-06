'use strict';

const _ = require('lodash');
const demFeels = require('dem-feels');
const escapeHtml = require('./escapeHtml');
const fs = require('fs');
const path = require('path');

const MAX_MESSAGE_LENGTH = 300;
const MESSAGE_COOLDOWN = 400;
const SAME_MESSAGE_COOLDOWN = 5 * 60 * 1000;
const VALID_COMMAND_TOKENS = '/';

let commands = {};

const baseDir = path.join(__dirname, 'commands');
fs.readdirSync(baseDir)
  .filter(name => name !== 'index.js')
  .forEach(name => {
    _.assign(commands, require(path.join(baseDir, name)));
  });

function parser(message, user) {
  const context = this.context;
  const diff = Date.now() - user.lastMessageTime;
  if (diff < MESSAGE_COOLDOWN) {
    context.errorReply('Your message was not sent because you have sented too many messages.');
    return false;
  }
  user.lastMessageTime = Date.now();

  if (!message || !message.trim().length) return;

  let cmd = '', target = '', cmdToken = '';

  const isValidCmdToken = VALID_COMMAND_TOKENS.includes(message.charAt(0));
  const isEscapedCmd = message.charAt(1) === message.charAt(0);

  if (isValidCmdToken && !isEscapedCmd) {
    cmdToken = message.charAt(0);
    let spaceIndex = message.indexOf(' ');
    if (spaceIndex > 0) {
      cmd = message.substr(1, spaceIndex - 1).toLowerCase();
      target = message.substr(spaceIndex + 1);
    } else {
      cmd = message.substr(1).toLowerCase();
      target = '';
    }
  }

  let commandHandler = commands[cmd];
  if (commandHandler) {
    if (typeof commandHandler === 'string') {
      commandHandler = commands[commandHandler];
    }
    commandHandler.call(context, target, this.room, user);
    return false;
  } else if (cmdToken) {
    context.errorReply('The command \'' + cmdToken + cmd + '\' was unrecognized. To send a message starting with \'' + cmdToken + cmd + '\', type \'' + cmdToken.repeat(2) + cmd + '\'.');
    return false;
  } else if (isValidCmdToken && isEscapedCmd) {
    message = message.substr(1);
  }

  if (message.length > MAX_MESSAGE_LENGTH) return false;

  if (/[\u239b-\u23b9]/.test(message)) {
    context.errorReply('Your message contains banned characters.');
    return false;
  }

  const normalized = message.trim();
  if ((normalized === user.lastMessage) && diff < SAME_MESSAGE_COOLDOWN) {
    context.errorReply('You can\'t send the same message again so soon.');
    return false;
  }
  user.lastMessage = normalized;

  if (user.isMuted) {
    context.errorReply('You are muted and cannot talk in this room.');
    return false;
  }

  return {text: markup(normalized), username: user.name, rank: user.rankDisplay};
}

function markup(message) {
  const chained =
    // escape html
    escapeHtml(message)

    // remove zalgo
    .replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '')
    .replace(/[\u239b-\u23b9]/g, '')

    // ``code``
    .replace(/\`\`([^< ](?:[^<`]*?[^< ])??)\`\`/g, '<code>$1</code>')

    // __italics__
    .replace(/\_\_([^< ](?:[^<]*?[^< ])??)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>')

    // **bold**
    .replace(/\*\*([^< ](?:[^<]*?[^< ])??)\*\*/g, '<b>$1</b>')

    // linking of URIs
    .replace(/(https?\:\/\/[a-z0-9-.]+(\/([^\s]*[^\s?.,])?)?|[a-z0-9]([a-z0-9-\.]*[a-z0-9])?\.(com|org|net|edu|tk|us|io|me)((\/([^\s]*[^\s?.,])?)?|\b))/ig, '<a href="$1" target="_blank">$1</a>')
    .replace(/<a href="([a-z]*[^a-z:])/g, '<a href="http://$1').replace(/(\bgoogle ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&q=$2" target="_blank">$1</a>')
    .replace(/(\bgl ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$2" target="_blank">$1</a>')
    .replace(/(\bwiki ?\[([^\]<]+)\])/ig, '<a href="http://en.wikipedia.org/w/index.php?title=Special:Search&search=$2" target="_blank">$1</a>')
    .replace(/\[\[([^< ]([^<`]*?[^< ])?)\]\]/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$1" target="_blank">$1</a>');

  // emotes
  return demFeels(chained);
}

module.exports = parser;
