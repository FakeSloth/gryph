'use strict';

const _ = require('lodash');
const config = require('../config');
const db = require('../db');
const got = require('got');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const winston = require('winston');

const domain = 'https://www.googleapis.com/youtube/v3/search';
const queries = '?part=snippet&maxResults=20';
const baseUrl = domain + queries + '&key=' + config.googleAPIKey + '&q=';

function search(req, res, next) {
  if (!req.body.term) return;
  jwt.verify(req.body.token, config.jwtSecret, (err, decoded) => {
    if (err) return next(err);
    let videos = [];
    got(baseUrl + req.body.term)
      .then(response => {
        const json = JSON.parse(response.body);
        videos = _.map(json.items, getContent);
        const ids = videos.map(video => video.videoId).join(',');
        const url = 'https://www.googleapis.com/youtube/v3/videos?id=' + ids + '&key=' + config.googleAPIKey + '&part=snippet,contentDetails';
        return got(url);
      })
      .then(response => {
        const json = JSON.parse(response.body);
        if (!json.items.length) return next();
        console.log(json.items.length, videos.length)
        videos = _.map(videos, (video, index) => {
          const item = json.items[index];
          if (!item) return video;
          const duration = item.contentDetails.duration;
          const md = moment.duration(duration);
          const hours = md.hours() ? (md.hours() < 10 ? '0' + md.hours() : md.hours()) + ':' : '';
          const minutes = md.minutes() ? (md.minutes() < 10 ? '0' + md.minutes() : md.minutes()) + ':' : '0:';
          const seconds = md.seconds() ? (md.seconds() < 10 ? '0' + md.seconds() : md.seconds()) : '';
          video.duration = hours + minutes + seconds;
          return video;
        });
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
    url: 'https://www.youtube.com/watch?v=' + data.id.videoId,
    videoId: data.id.videoId
  };
}

module.exports = search;
