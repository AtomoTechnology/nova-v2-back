'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'El nombre no puede ser vacío',
          },
        },
      },
      trademark: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'El nombre no puede ser vacío',
          },
        },
      },
      description: {
        type: Sequelize.TEXT('long'),
        validate: {
          notEmpty: {
            msg: 'El nombre no puede ser vacío',
          },
        },
      },
      photo: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La imagen no puede ser vacío',
          },
        },
      },
      price: {
        type: Sequelize.FLOAT,
        validate: {
          notEmpty: {
            msg: 'El precio no puede ser vacío',
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  },
};
