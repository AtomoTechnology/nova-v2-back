'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorksState extends Model {
    static associate(models) {
      // WorksState.belongsTo(models.Work, { foreignKey: 'WorkId', targetKey: 'uuid' });
      WorksState.belongsTo(models.State, { foreignKey: 'StateId', targetKey: 'uuid' });
    }
  }
  WorksState.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      WorkId: {
        allowNull: false,
        type: DataTypes.UUIDV4,
      },
      StateId: {
        allowNull: false,
        type: DataTypes.UUIDV4,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'WorksState',
    }
  );
  return WorksState;
};
