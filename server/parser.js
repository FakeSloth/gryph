'use strict';

const demFeels = require('dem-feels');

const MAX_MESSAGE_LENGTH = 300;

const MESSAGE_COOLDOWN = 500;

const VALID_COMMAND_TOKENS = '/!';

const BROADCAST_TOKEN = '!';

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function escapeHTML(string) {
  return String(string).replace(/[&<>]/g, function (s) {
    return entityMap[s];
  });
}

function parser(message, user, emit) {
  const diff = Date.now() - user.lastMessageTime;
  if (diff < MESSAGE_COOLDOWN) {
    emit({
      text: 'Your message was not sent because you have sented too many messages.',
      className: 'text-danger'
    });
    return false;
  }
  user.lastMessageTime = Date.now();

  if (!message || !message.trim().length) return;


  return {text: markup(message), username: user.name};
}

function markup(message) {
  const chained =
    // escape html
    escapeHTML(message)

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
