'use strict';

const demFeels = require('dem-feels');
const escapeHTML = require('./utils').escapeHTML;

function parser(str) {
  // escape html
  str = escapeHTML(str);
  // ``code``
  str = str.replace(/\`\`([^< ](?:[^<`]*?[^< ])??)\`\`/g, '<code>$1</code>');
  // __italics__
  str = str.replace(/\_\_([^< ](?:[^<]*?[^< ])??)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>');
  // **bold**
  str = str.replace(/\*\*([^< ](?:[^<]*?[^< ])??)\*\*/g, '<b>$1</b>');
  // linking of URIs
  str = str
    .replace(/(https?\:\/\/[a-z0-9-.]+(\/([^\s]*[^\s?.,])?)?|[a-z0-9]([a-z0-9-\.]*[a-z0-9])?\.(com|org|net|edu|tk|us|io|me)((\/([^\s]*[^\s?.,])?)?|\b))/ig, '<a href="$1" target="_blank">$1</a>')
    .replace(/<a href="([a-z]*[^a-z:])/g, '<a href="http://$1').replace(/(\bgoogle ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&q=$2" target="_blank">$1</a>')
    .replace(/(\bgl ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$2" target="_blank">$1</a>')
    .replace(/(\bwiki ?\[([^\]<]+)\])/ig, '<a href="http://en.wikipedia.org/w/index.php?title=Special:Search&search=$2" target="_blank">$1</a>')
    .replace(/\[\[([^< ]([^<`]*?[^< ])?)\]\]/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$1" target="_blank">$1</a>');
    // email addresses
    .replace(/[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim, '<a href="mailto:$&">$&</a>');
  // emotes
  str = demFeels(str);

  return str;
}

module.exports = parser;
