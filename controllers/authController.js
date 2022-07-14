const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('../helpers/catchAsync');
// const User = require('./../models2/userModel');
const { User } = require('./../models');
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/AppError');
const sendEmail = require('../helpers/email');
const Email = require('../helpers/sendEmail');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const factory = require('./factoryController');

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

const createSendToken = (user, statusCode, res) => {
  // console.log('User JWT : ', user);
  // console.log('User id : ', user.id);
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

  // const url = `${req.protocol}://novatechnologyargentina.com/clients/${newUser._id}`;
  // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { dni, password } = req.body;

  if (!dni || !password) {
    return next(new AppError('Ingrese su DNI y/o su contraseña por favor', 403));
  }

  const user = await User.findOne({ where: { dni } });
  // console.log('login', user);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('DNI y/o Contraseña incorrecto.', 401));
  }
  if (!user.active) {
    return next(new AppError('Tu cuenta está inactivo! Activalo para poder iniciar sesión', 401));
  }
  req.user = user.dataValues;
  console.log('req saved: ', req.user);

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

  console.log(decoded);
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
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('This is no user with this email ..', 404));
  }

  //2) generate the random  token
  const resetToken = user.createPasswordResetToken();

  // we just modify data from the object  we have to save it
  await user.save({ validateBeforeSave: false }); //

  //send email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `¿Forgot your password ? click on this link : ${resetURL} to resetyour password.\n if you did forget your password ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mn)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was a problem sending the email ', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get Uer based on the token
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('This is no user for this token. Token invalid or expired ..', 404));
  }

  //validate user and token
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //Log in user again
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get the user
  const user = await User.findOne({ where: { email: req.user.email, dni: req.user.dni } });
  console.log('User : ', user);

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
