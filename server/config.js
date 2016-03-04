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
  0: ' ',
  1: '<img src="https://help.twitch.tv/customer/portal/attachments/349944" title="Voice" height="18" width="18">',
  2: '<img src="https://help.twitch.tv/customer/portal/attachments/349943" title="Moderator" height="18" width="18">',
  3: '<img src="https://help.twitch.tv/customer/portal/attachments/387081" title="Global Moderator" height="18" width="18">',
  4: '<img src="https://help.twitch.tv/customer/portal/attachments/349941" title="Adminstrator" height="18" width="18">',
  5: '<img src="https://help.twitch.tv/customer/portal/attachments/349938" title="Staff" height="18" width="18">'
};

config.rankNames = {
  'voice': 1,
  'mod': 2,
  'gmod': 3,
  'admin': 4,
  'staff': 5
};

config.videoLimit = 600000; // 10 minutes in millisecnds

config.faviconCache = 604800000; // 1 week

config.isDev = process.env.NODE_ENV !== 'production';

module.exports = config;
