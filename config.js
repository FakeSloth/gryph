'use strict';

let config = {};

config.port = process.env.PORT || 3000;

config.googleAPIKey = process.env.GOOGLE_API_KEY || 'AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw';

module.exports = config;
