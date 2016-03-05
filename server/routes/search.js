'use strict';

const _ = require('lodash');
const config = require('../config');
const db = require('../db');
const got = require('got');
const jwt = require('jsonwebtoken');
const winston = require('winston');

const domain = 'https://www.googleapis.com/youtube/v3/search';
const queries = '?part=snippet&maxResults=20';
const baseUrl = domain + queries + '&key=' + config.googleAPIKey + '&q=';

function search(req, res, next) {
  if (!req.body.term) return;
  jwt.verify(req.body.token, config.jwtSecret, (err, decoded) => {
    if (err) return next(err);
    got(baseUrl + req.body.term)
      .then(response => {
        const json = JSON.parse(response.body);
        const videos = _.map(json.items, getContent);
        res.json({videos});
      })
      .catch((err) => {
        winston.error(err);
        next(err);
      });
  });
}

function getContent(data) {
  return {
    title: data.snippet.title,
    image: data.snippet.thumbnails.medium.url,
    publishedAt: data.snippet.publishedAt,
    url: 'https://www.youtube.com/watch?v=' + data.id.videoId
  };
}

module.exports = search;
