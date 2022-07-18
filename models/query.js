'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Query extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Query.belongsTo(models.User, { foreignKey: 'UserId', targetKey: 'uuid' });
    }
  }
  Query.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        type: DataTypes.UUID,
      },
      message: {
        type: DataTypes.STRING(200),
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      responses: {
        type: DataTypes.JSON,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Query',
    }
  );
  return Query;
};
