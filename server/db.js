const config = require('./config');
const db = require(config.database.name)(config.database.location);

module.exports = db;
