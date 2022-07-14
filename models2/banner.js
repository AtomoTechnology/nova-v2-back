const sequelize = require('../database/config');
const { DataTypes } = require('sequelize');

const Banner = sequelize.define(
  'banner',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    photo: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
  },
  {}
);

module.exports = Banner;
