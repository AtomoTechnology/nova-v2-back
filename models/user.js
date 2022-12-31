'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Work, { foreignKey: 'UserId', sourceKey: 'uuid' });
      // User.hasMany(models.Work, { foreignKey: 'assignedToId', as: 'assignedTo', sourceKey: 'uuid' });
      User.hasMany(models.Order, { foreignKey: 'UserId', sourceKey: 'uuid' });
    }
  }
  User.init(
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
        type: DataTypes.STRING(100),
        allowNull: true,
        set(value) {
          this.setDataValue('name', value.toString().trim());
        },
        validate: {},
      },

      dni: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: [true, 'EL dni es obligatorio para crear tu cuenta'],
        set(value) {
          this.setDataValue('dni', value.toString().trim());
        },
        validate: {
          isNumeric: {
            msg: 'El dni solo puedo contener numeros 0-9',
          },

          len: {
            args: [8, 11],
            msg: 'El dni/cuil debe tener 8 numero como minimo y 11 como maximo',
          },
        },
      },
      phone1: {
        type: DataTypes.STRING(20),
        allowNull: [false, 'Es obligatorio ingresar un numero de telefono'],
        validate: {},
      },
      phone2: {
        type: DataTypes.STRING(20),
      },
      country: {
        type: DataTypes.STRING(50),
      },
      province: {
        type: DataTypes.STRING(50),
      },
      city: {
        type: DataTypes.STRING(50),
      },
      direction: {
        type: DataTypes.STRING(100),
      },
      directionNumber: {
        type: DataTypes.STRING(5),
      },
      floor: {
        type: DataTypes.STRING(2),
      },
      dept: {
        type: DataTypes.STRING(2),
      },
      nota: {
        type: DataTypes.STRING(100),
      },

      email: {
        type: DataTypes.STRING,
        // unique: true,
        // required: [true, 'Por favor ingrese su email'],
        // lowercase: true,
        validate: {
          // isEmail: {
          //   msg: 'Por favor ingrese su email',
          // },
        },
        set(value = '') {
          this.setDataValue('email', value.trim().toLowerCase());
        },
      },
      photo: DataTypes.TEXT('long'),
      photoPublicId: DataTypes.STRING,
      role: {
        type: DataTypes.STRING(15),
        defaultValue: 'user',
        validate: {
          isIn: [['user', 'tecnico', 'admin', 'provider']],
        },
      },
      password: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          min: 6,
          // notNull: {
          //   msg: 'Por favor ingrese una contraseña',
          // },
        },
        // select: false,
      },

      passwordChangedAt: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        // select: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      birthday: {
        allowNull: true,
        type: DataTypes.DATEONLY,
        defaultValue: null,
        // set(value) {
        //   if (value == '') {
        //     this.setDataValue('email', null);
        //   }
        // },
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.beforeSave(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
  });

  return User;
};
