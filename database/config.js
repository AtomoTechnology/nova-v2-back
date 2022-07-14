const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nova34', 'root', 'jhm.ok', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
