'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {}
  }
  Product.init(
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
      model: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'El modelo no puede ser vacío',
          },
        },
      },
      storage: {
        type: DataTypes.JSON,
        validate: {
          notEmpty: {
            msg: 'El almacenamiento no puede ser vacío',
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: 'El stock no puede ser vacío',
          },
        },
      },
      colours: {
        type: DataTypes.JSON,
        validate: {
          notEmpty: {
            msg: 'El color no puede ser vacío',
          },
        },
      },
      trademark: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'La marca no puede ser vacío',
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'El estado no puede ser vacío',
          },
        },
      },
      description: {
        type: DataTypes.TEXT('long'),
        validate: {
          notEmpty: {
            msg: 'El nombre no puede ser vacío',
          },
        },
      },
      photo: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La imagen no puede ser vacío',
          },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        validate: {
          notEmpty: {
            msg: 'El precio no puede ser vacío',
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
      modelName: 'Product',
    }
  );
  return Product;
};
