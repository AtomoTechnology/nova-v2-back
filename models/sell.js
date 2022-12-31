'use strict';
const { Model } = require('sequelize');

const getDate = () => {
  var d = new Date();
  d.setTime(d.getTime() - 3 * 60 * 60 * 1000);
  return d.toJSON().slice(0, 10) + ' ' + d.toJSON().slice(12, 19);
  // return d.toJSON();
};
module.exports = (sequelize, DataTypes) => {
  class Sell extends Model {
    static associate(models) {
      Sell.belongsTo(models.User, { foreignKey: 'UserId', targetKey: 'uuid' });
      Sell.belongsTo(models.Product, { foreignKey: 'ProductId', targetKey: 'uuid' });
      Sell.belongsTo(models.User, {
        foreignKey: {
          name: 'sellerId',
          allowNull: true,
          defaultValue: null,
        },
        as: 'seller',
        targetKey: 'uuid',
      });
      Sell.belongsTo(models.User, {
        foreignKey: {
          name: 'providerId',
          allowNull: true,
          defaultValue: null,
        },
        as: 'provider',
        targetKey: 'uuid',
      });
    }
  }
  Sell.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      state: {
        type: DataTypes.STRING(30),
        // required: [true, 'El modelo  es obligatoria.'],
      },
      observaciones: {
        type: DataTypes.STRING(500),
        // required: [true, 'Es obligatorio una observaciones.'],
      },
      precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        // required: [true, 'El precio es obligatorio '],
      },
    },
    {
      sequelize,
      modelName: 'Sell',
    }
  );
  return Sell;
};
