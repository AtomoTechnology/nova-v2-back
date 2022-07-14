const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const UserEx = require('./../models2/userModel');
const { User, Work, Contact } = require('./../models');
const factory = require('./factoryController');
const { Op } = require('sequelize');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.migrateUsers = async (req, res) => {
  let query = UserEx.find();
  const users = await query;
  users.forEach(async (user) => {
    // console.log(user.dni, '-', user.name, '-', user._id, '-', user._id.toString().replace(/"/, ''));
    // return;
    await User.create({
      dni: user.dni,
      uuid: user._id.toString().replace(/"/, ''),
      name: user.name,
      email: user.email,
      phone1: user.phone1,
      phone2: user.phone2,
      direction: user.direction,
      active: user.active,
      nota: user.nota,
      role: user.role,
      password: user.password,
      passwordChangedAt: user.passwordChangedAt,
      createdAt: user.createAt,
      photo: user.photo,
    });
  });

  res.status(200).json({
    status: 'successs',
    results: users.length,
    data: {
      users,
    },
  });
};

exports.filters = factory.all(User);
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
    // where: req.query,
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
exports.getAllUsers1 = async (req, res) => {
  // const { count, rows } = await Project.findAndCountAll({
  //   where: {
  //     title: {
  //       [Op.like]: 'foo%',
  //     },
  //   },
  //   offset: 10,
  //   limit: 2,
  // });
  // console.log(count);
  // console.log(rows);
  let filter = {};
  // if (req.query.search)
  //   filter = {
  //     $or: [
  //       { name: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
  //       { dni: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
  //     ],
  //   };
  // let query = UserEx.find(filter);
  // let queryTotal = UserEx.find(filter);

  // query = query.sort({ createAt: -1, name: 1 });

  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 50;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // let totalPage = 1;
  // let page = 1;

  // const total = await queryTotal.countDocuments();
  // if (req.query.limit && req.query.page) {
  //   page = req.query.page * 1 || 1;
  //   const limit = req.query.limit * 1 || 30;
  //   const skip = (page - 1) * limit;
  //   query = query.skip(skip).limit(limit);
  //   totalPage = Math.ceil(total / limit);
  // }

  // const users = await query;

  // users.forEach(async (user) => {
  //   // console.log(user.dni, '-', user.name, '-', user.id, '-', user.email);
  //   // return;
  //   await User.create({
  //     dni: user.dni,
  //     uuid: user._id,
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
  //     photo: user.photo,
  //   });
  // });
  // for (let i = 0; i < users.length; i++) {
  //   // const element = users[i];
  //   await User.create(users[i]);
  //   console.log(users[i]);
  // }
  // const users = await User.findAll();
  // const users = factory.all(User);
  // console.log(users);

  res.status(200).json({
    status: 'success',
    results: users.length,
    // page,
    // totalPage,
    // total: total,
    // results: users.length,
    data: {
      users,
    },
  });
};

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
exports.GetTotalUsers = catchAsync(async (req, res, next) => {
  const total = await User.countDocuments();
  res.status(200).json({
    status: 'success',
    total,
  });
});
exports.find = factory.find(User);
exports.updateUser = factory.update(User, ['name', 'email', 'dni', 'phone1', 'phone2', 'nota', 'direction']);
exports.UpdateAvatar = catchAsync(async (req, res, next) => {
  console.log(req.params, req.query);
  const { photo } = req.body;
  if (!photo) return next(new AppError('Para actualizar la imagen hace falta el campo photo', 400));

  if (!req.params.id) return next(new AppError('Necesitas el id del usuario', 400));

  await User.update({ photo }, { where: { uuid: req.params.id } });

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
