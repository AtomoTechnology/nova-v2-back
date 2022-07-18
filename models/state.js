'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    static associate(models) {
      State.belongsToMany(models.Work, {
        through: 'worksstates',
        as: 'works',
        foreignKey: 'StateId',
        sourceKey: 'uuid',
      });

      State.hasMany(models.WorksState, {
        as: 'WorksStates',
        foreignKey: 'StateId',
        sourceKey: 'uuid',
      });
    }
  }
  State.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'EL nombre debe ser uníco',
        },
        validate: {
          notEmpty: {
            msg: 'El nombre no puede ser vacío',
          },
        },
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
      modelName: 'State',
    }
  );
  return State;
};
