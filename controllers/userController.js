const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const { User, Work, Contact } = require('./../models');
const factory = require('./factoryController');
const { Op } = require('sequelize');
const UserEx = require('../models2/userModel');

exports.all = factory.all(User);
exports.allPagination = catchAsync(async (req, res, next) => {
  let totalPage = 1;
  let page = 1;
  let limit = 1;
  let skip = 0;
  if (req.query.limit && req.query.page) {
    page = req.query.page * 1 || 1;
    limit = req.query.limit * 1 || 30;
    skip = (page - 1) * limit;
  }

  const docs = await User.findAndCountAll({
    include: [],
    order: [
      ['createdAt', 'DESC'],
      ['name', 'DESC'],
    ],
    limit: limit,
    offset: skip,
  });
  if (req.query.limit && req.query.page) {
    totalPage = Math.ceil(docs.count / limit);
  }

  res.status(200).json({
    status: 'success',
    page,
    totalPage,
    total: docs.count,
    results: docs.count,
    data: {
      users: docs.rows,
    },
  });
});

exports.findByUuid = factory.findByUuid(User);
exports.SearchUser = async (req, res) => {
  if (!req.params.filter) return next(new AppError('Hace falta un filtro para buscar el usuario', 400));

  let users = await User.findAll({
    where: {
      [Op.or]: {
        name: {
          [Op.like]: `%${req.params.filter}%`,
        },
        dni: {
          [Op.like]: `%${req.params.filter}%`,
        },
      },
    },
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};
exports.GetMe = catchAsync(async (req, res, next) => {
  if (!req.params.id) req.params.id = req.user.id;
  next();
});
exports.find = factory.find(User);
exports.updateUser = factory.update(User, ['name', 'email', 'dni', 'phone1', 'phone2', 'nota', 'direction']);
exports.UpdateAvatar = catchAsync(async (req, res, next) => {
  const { photo } = req.body;
  if (!photo) return next(new AppError('Para actualizar la imagen hace falta el campo photo', 400));

  if (!req.params.id) return next(new AppError('Necesitas el id del usuario', 400));

  await User.update({ photo }, { where: { id: req.params.id } });

  res.status(200).json({
    status: 'success',
    message: 'Imagen actualizado con exito',
  });
});
exports.delete = factory.delete(User);
exports.updateMe = factory.update(User, ['name', 'email', 'dni', 'phone1', 'phone2', 'nota', 'direction']);
exports.setDeleteMe = catchAsync(async (req, res, next) => {
  req.body.active = false;
  req.params.id = req.user.id;
  next();
});

exports.deleteMe = factory.update(User, ['active']);

//contact api
exports.contact = factory.all(Contact);
exports.createContact = factory.create(Contact, null, { mail: true });
exports.deleteContact = factory.delete(Contact);

exports.migrateUsers = catchAsync(async (req, res) => {
  let query = UserEx.find().limit(1);
  // return ;
  const users = await query;
  // users.forEach(async (user) => {
  //   await User.create({
  //     dni: user.dni,
  //     uuid: user._id.toString().replace(/"/, ''),
  //     name: user.name,
  //     email: user.email,
  //     phone1: user.phone1,
  //     phone2: user.phone2,
  //     direction: user.direction,
  //     active: user.active,
  //     nota: user.nota,
  //     role: user.role,
  //     password: user.password,
  //     passwordChangedAt: user.passwordChangedAt,
  //     createdAt: user.createAt,
  //     photo: user?.photo ? user.photo : '',
  //   });
  // });

  res.status(200).json({
    status: 'successs',
    results: users.length,
    data: {
      users,
    },
  });
});
