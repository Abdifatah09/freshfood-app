const { Sequelize } = require('sequelize');
const config = require('./config/config'); // Import database config

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect,
  port: config.development.port,
});

module.exports = { sequelize }; // Export sequelize instance for use in models
