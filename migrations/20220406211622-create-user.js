'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
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
        type: Sequelize.STRING(100),
        allowNull: false,
        set(value) {
          this.setDataValue('name', value.trim());
        },
        validate: {
          // notNull: {
          //   msg: 'Por Favor ingrese su nombre',
          // },
        },
      },

      dni: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true,
        validate: {
          // isNumeric: {
          //   msg: 'El dni solo puedo contener numeros 0-9',
          // },
          // notNull: {
          //   msg: 'EL dni es obligatorio para crear tu cuenta',
          // },
          len: {
            args: [5, 10],
            msg: 'El dni/cuil debe tener 8 numero como minimo y 11 como maximo',
          },
        },
      },
      phone1: {
        type: Sequelize.STRING(20),
        validate: {
          // notNull: {
          //   msg: 'Es obligatorio ingresar un numero de telefono',
          // },
        },
      },
      phone2: {
        type: Sequelize.STRING(20),
      },
      direction: {
        type: Sequelize.STRING(100),
      },
      nota: {
        type: Sequelize.STRING(100),
      },

      email: {
        type: Sequelize.STRING,
        // unique: true,
        // required: [true, 'Por favor ingrese su email'],
        // lowercase: true,
        // validate: {
        //   isEmail: {
        //     msg: 'Por favor ingrese su email',
        //   },
        // },
        // set(value=) {
        //   this.setDataValue('email', value.toLowerCase());
        // },
      },
      photo: Sequelize.TEXT('long'),
      role: {
        type: Sequelize.STRING(15),
        defaultValue: 'user',
        validate: {
          isIn: [['user', 'tecnico', 'admin']],
        },
      },
      password: {
        type: Sequelize.STRING,
        required: true,
        validate: {
          min: 6,
          // notNull: {
          //   msg: 'Por favor ingrese una contraseña',
          // },
        },
        // select: false,
      },
      // passwordConfirm: {
      //   type: Sequelize.STRING,
      //   defaultValue: '',
      //   required: [true, 'Las contraseñas no coinciden.'],
      //   validate: {
      //     // customValidator(value) {
      //     //   if (value === null || this.password !== value) {
      //     //     throw new Error('Las contraseñas no coinciden.');
      //     //   }
      //     // },
      //   },
      // },
      passwordChangedAt: Sequelize.DATE,
      passwordResetToken: Sequelize.STRING,
      passwordResetExpires: Sequelize.DATE,
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        // select: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
