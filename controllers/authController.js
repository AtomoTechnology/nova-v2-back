const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('../helpers/catchAsync');
const { User } = require('./../models');
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/AppError');
const sendEmail = require('../helpers/email');
const Email = require('../helpers/sendEmail');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const factory = require('./factoryController');
const EmailResetPassword = require('../helpers/resetPassword');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN_NOVA, {
    expiresIn: process.env.SECRET_TOKEN_NOVA_INSPIRE_IN,
  });
};

const changePasswordAfter = function (user, jwtIat) {
  if (user.passwordChangedAt) {
    const changePassword = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    return jwtIat < changePassword;
  }
  return false;
};

const createPasswordResetToken = (user) => {
  //create token
  const resetToken = crypto.randomBytes(32).toString('hex');
  //encrypt the token and save to the database
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  //store the time plus 10 mns to the satabase
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //return the token without encrypt
  return resetToken;
};

const createSendToken = (user, statusCode, res) => {
  const token = createToken(user.id);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.renewToken = catchAsync(async (req, res, next) => {
  createSendToken(req.user, 200, res);
});

exports.signUp = catchAsync(async (req, res, next) => {
  if (await User.findOne({ where: { [Op.or]: [{ dni: req.body.dni }, { email: req.body.email }] } }))
    return next(new AppError('Este usuario ya existe. Por favor Inicia Sesion con tu dni y contraseña.', 401));
  const newUser = await User.create(req.body);
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  //send email ${req.get('host')}

  const url = `${req.protocol}://novatechnologyargentina.com/clients/${newUser.id}`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { dni, password } = req.body;

  if (!dni || !password) {
    return next(new AppError('Ingrese su DNI y/o su contraseña por favor', 403));
  }

  const user = await User.findOne({ where: { dni } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('DNI y/o Contraseña incorrecto.', 401));
  }
  if (!user.active) {
    return next(new AppError('Tu cuenta está inactivo! Activalo para poder iniciar sesión', 401));
  }

  if (req.body.role) {
    if (user.role != 'admin' && user.role != 'tecnico') {
      return next(new AppError('Este espacio es solamente para administrador y tecnicos !', 401));
    }
  }

  req.user = user.dataValues;

  //create token
  createSendToken(user, 200, res);
});

exports.delete = factory.delete(User);

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No estás loggeado . Por favor Inicia session. ', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_TOKEN_NOVA);

  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(new AppError('Este usuario ya no existe ', 404));
  }

  //check if user change the password
  if (changePasswordAfter(currentUser, decoded.iat)) {
    return next(new AppError('Este usuario cambió su contraseña recientemente . Por favor inicia session.', 401));
  }

  //grant the access
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('No tiene permiso para realizar esta accion.', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get the user and validate it
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new AppError('No hay usuario con este  email ..', 404));
  }

  //2) generate the random  token
  const resetToken = createPasswordResetToken(user);

  // we just modify data from the object  we have to save it
  await user.save(); //

  //send email
  const resetURL = `${req.protocol}://novatechnologyargentina.com/resetPassword/${resetToken}`;
  const message = `¿Olvidaste tu contraseña ? hace click  en este enlace  : ${resetURL}  para resetear tu contraseña.`;
  try {
    await new EmailResetPassword({ url: resetURL, message }).sendResetPass();

    res.status(200).json({
      ok: true,
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(new AppError('Hubo un problema al intentar mandarte el email! ', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get Uer based on the token
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    where: {
      passwordResetToken: hashToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    return next(new AppError('No existe usuario con este token ! Token expirado o invalido...', 404));
  }

  //validate user and token
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  const usersave = await user.save();
  // await User.update(user, {
  //   where: {
  //     id: user.id,
  //   },
  // });
  res.json({
    ok: true,
    status: 'success',
  });

  //Log in user again
  // createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get the user
  const user = await User.findOne({ where: { email: req.user.email, dni: req.user.dni } });
  //check password
  // if (!user || !(await user.checkPassword(req.body.currentPassword, user.password))) {
  //   return next(new AppError('Contraseña invalida', 401));
  // }
  if (!user || !(await bcrypt.compare(req.body.currentPassword, user.password))) {
    return next(new AppError('DNI y/o Contraseña incorrecto.', 401));
  }

  //update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = new Date();
  await user.save();
  return res.status(200).json({
    status: 'success',
    message: 'Contraseña actualizada con exito!✅',
  });
  // User.findByIdAndUpdate() will not work

  //log in user
  // createSendToken(user, 200, res);
});
