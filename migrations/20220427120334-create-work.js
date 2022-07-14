'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Works', {
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
      codigo: {
        type: Sequelize.STRING,
        // required: [true, 'EL codigo es obligatorio.'],
        // required: true,
      },
      marca: {
        type: Sequelize.STRING,
        // required: [true, 'La marca  es obligatoria.'],
      },
      modelo: {
        type: Sequelize.STRING,
        // required: [true, 'El modelo  es obligatoria.'],
      },
      emei: {
        type: Sequelize.STRING,
      },
      fachasEncontradas: {
        type: Sequelize.STRING(1000),
      },
      observaciones: {
        type: Sequelize.STRING(500),
        // required: [true, 'Es obligatorio una observaciones.'],
      },
      descripcion: {
        type: Sequelize.STRING(500),
      },

      recargo: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      precio: {
        type: Sequelize.FLOAT,
        // required: [true, 'El precio es obligatorio '],
      },
      total: {
        type: Sequelize.FLOAT,
      },
      descuento: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      states: {
        type: Sequelize.JSON,
      },
      StateId: {
        type: Sequelize.UUID,
      },
      UserId: {
        type: Sequelize.UUID,
      },
      fechaFin: {
        type: Sequelize.DATE,
      },
      contrasena: {
        type: Sequelize.STRING(50),
      },
      patron: {
        type: Sequelize.STRING(50),
      },
      esPatron: {
        type: Sequelize.BOOLEAN,
      },
      tieneContrasena: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Works');
  },
};
