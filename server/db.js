const config = require('./config');
const db = require('origindb')(config.database.location, {
  adapter: config.database.name
});

module.exports = db;
