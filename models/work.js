'use strict';
const { Model } = require('sequelize');
const { User } = require('../models');
module.exports = (sequelize, DataTypes) => {
  class Work extends Model {
    static associate(models) {
      Work.belongsTo(models.State, { foreignKey: 'StateId', targetKey: 'uuid' });
      // join with uuid of User table...
      Work.belongsTo(models.User, { foreignKey: 'UserId', targetKey: 'uuid' });
      // models.User.hasMany(models.Work, { foreignKey: 'UserId', sourceKey: 'uuid' });
      Work.belongsToMany(models.State, {
        through: 'worksstates',
        as: 'statess',
        foreignKey: 'WorkId',
        sourceKey: 'uuid',
      });
      Work.hasMany(models.WorksState, {
        as: 'states',
        foreignKey: 'WorkId',
        sourceKey: 'uuid',
      });

      //    estado: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'State',
      //   required: [true, 'El estado es obligatorio'],
      // },
      // cliente: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'Client',
      //   required: [true, ' Es obligatorio el cliente'],
      // },
    }
  }
  Work.init(
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
      // states: {
      //   type: DataTypes.JSON,
      // },

      codigo: {
        type: DataTypes.STRING(20),
        // required: [true, 'EL codigo es obligatorio.'],
      },
      marca: {
        type: DataTypes.STRING,
        // required: [true, 'La marca  es obligatoria.'],
      },
      modelo: {
        type: DataTypes.STRING,
        // required: [true, 'El modelo  es obligatoria.'],
      },
      emei: {
        type: DataTypes.STRING,
      },
      fachasEncontradas: {
        type: DataTypes.STRING(1000),
      },
      observaciones: {
        type: DataTypes.STRING(500),
        // required: [true, 'Es obligatorio una observaciones.'],
      },
      descripcion: {
        type: DataTypes.STRING(500),
      },

      recargo: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      precio: {
        type: DataTypes.FLOAT,
        // required: [true, 'El precio es obligatorio '],
      },
      total: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      descuento: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // fechaInicio: {
      //   type: Date,
      //   // required: true,
      //   default: Date.now,
      // },

      fechaFin: {
        type: DataTypes.DATE,
      },

      contrasena: {
        type: DataTypes.STRING(50),
      },
      patron: {
        type: DataTypes.STRING(50),
      },
      esPatron: {
        type: DataTypes.BOOLEAN,
      },
      tieneContrasena: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'Work',
    }
  );
  return Work;
};
