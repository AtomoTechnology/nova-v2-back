'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    static associate(models) {
      Detail.belongsTo(models.Product, { foreignKey: 'ProductId', targetKey: 'uuid' });
      Detail.belongsTo(models.Order, { foreignKey: 'OrderId', targetKey: 'uuid' });
    }
  }
  Detail.init(
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
      quantity: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: 'La cantidad es obligatoria.',
          },
        },
      },
      storage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La cantidad es obligatoria.',
          },
        },
      },
      colour: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La cantidad es obligatoria.',
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Detail',
    }
  );
  return Detail;
};
