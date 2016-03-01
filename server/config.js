'use strict';

let config = {};

config.port = process.env.PORT || 3000;

config.googleAPIKey = process.env.GOOGLE_API_KEY || 'AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw';

config.jwtSecret = process.env.JWT_SECRET || 'super secret';

config.database = {
  name: process.env.DATABASE || 'origindb' || 'machdb',
  location: process.env.DATABASE_LOCATION || 'db' || 'mongodb://localhost:27017/myproject'
};

config.ranks = {
  0: '&nbsp;',
  1: '<img src="http://help.twitch.tv/customer/portal/attachments/349938" title="Adminstrator">'
};

module.exports = config;
