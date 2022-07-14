'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {}
  }
  Contact.init(
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
      fullname: {
        type: DataTypes.STRING,
        validate: {
          // isAlphanumeric: {
          //   msg: 'El nombre debe contener solo caracteres [a-zA-Z]',
          // },
          notEmpty: {
            msg: 'El nombre no puede ser vacío',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'El email no es valido.',
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: 'Debe contener solamente digitos [0-9]',
          },
        },
      },
      message: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 500],
          notEmpty: {
            msg: 'El mensaje no puede ser vacío',
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
      modelName: 'Contact',
    }
  );
  return Contact;
};
