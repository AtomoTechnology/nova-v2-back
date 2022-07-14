const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por Favor ingrese su nombre'],
    trim: true,
  },

  dni: {
    type: String,
    required: [true, 'EL dni es obligatorio para crear tu cuenta'],
    validate: [validator.isNumeric, 'El dni solo puedo contener numeros 0-9'],
    unique: true,
    trim: true,
    minlength: [8, 'El dni/cuil debe tener 8 numero como minimo y 1 como maximo'],
    maxlength: [11, 'El dni/cuil debe tener 8 numero como minimo y 1 como maximo'],
    get: (val) => {
      return val.trim();
    },
  },
  phone1: {
    type: String,
    unique: [true, 'El numero de telefono debe ser unico.'],
    required: [true, 'Es obligatorio ingresar un numero de telefono'],
  },
  phone2: {
    type: String,
  },
  direction: {
    type: String,
  },
  nota: {
    type: String,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese su email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Por favor ingrese su email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'tecnico', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Por favor ingrese una contraseña'],
    minlength: 6,
    // select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Las contraseñas no coinciden.'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Las contraseñas no coinciden.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    // select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = async function (userPassword, hash) {
  return await bcrypt.compare(userPassword, hash);
};

userSchema.methods.changePasswordAfter = function (jwtIat) {
  if (this.passwordChangedAt) {
    const changePassword = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtIat < changePassword;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //create token
  const resetToken = crypto.randomBytes(32).toString('hex');
  //encrypt the token and save to the database
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  //store the time plus 10 mns to the satabase
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //return the token without encrypt
  return resetToken;
};
const User = mongoose.model('Client', userSchema);

module.exports = User;
