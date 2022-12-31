const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const { User, Contact } = require('./../models');
const factory = require('./factoryController');
const { Op } = require('sequelize');
var axios = require('axios');
const { cloudinary } = require('../helpers/cloudinary');

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
exports.updateUser = factory.update(User, [
  'name',
  'email',
  'dni',
  'phone1',
  'phone2',
  'nota',
  'country',
  'province',
  'city',
  'direction',
  'directionNumber',
  'floor',
  'dept',
  'birthday',
]);
exports.UpdateAvatar = catchAsync(async (req, res, next) => {
  const { photo } = req.body;
  if (req.body.photo == null) return next(new AppError('Para actualizar la imagen hace falta el campo photo', 400));

  if (!req.params.id) return next(new AppError('Necesitas el id del usuario', 400));

  cloudinary.uploader.upload(
    photo,
    {
      // upload_preset: '/NovaTech/usersAvatar',
      folder: '/NovaTech/usersAvatar',
    },
    async function (error, result) {
      if (error) return next(new AppError('Error al guardar la imagen!', 400));

      await User.update({ photo: result.url, photoPublicId: result.public_id }, { where: { id: req.params.id } });

      res.status(200).json({
        status: 'success',
        message: 'Imagen actualizado con exito',
        photo: result.url,
        photoPublicId: result.public_id,
      });
    }
  );
});
exports.DeleteUserAvatar = catchAsync(async (req, res, next) => {
  const { public_id } = req.body;
  if (req.body.public_id == null) return next(new AppError('Para actualizar la imagen hace el public_id ', 400));

  if (!req.params.id) return next(new AppError('Necesitas el id del usuario', 400));

  cloudinary.uploader.destroy(public_id, async function (error, result) {
    if (error) return next(new AppError('Error al eliminar la imagen!', 400));
    await User.update({ photo: '', photoPublicId: '' }, { where: { id: req.params.id } });

    res.status(200).json({
      status: 'success',
      message: 'Imagen actualizado con exito',
    });
  });
});
exports.delete = factory.delete(User);
exports.updateMe = factory.update(User, [
  'name',
  'email',
  'dni',
  'phone1',
  'phone2',
  'nota',
  'country',
  'province',
  'city',
  'direction',
  'directionNumber',
  'floor',
  'dept',
  'birthday',
]);
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

exports.getUsersByRoles = catchAsync(async (req, res) => {
  const fields = req.query.fields;
  let users = await User.findAll({
    where: {
      role: {
        [Op.or]: req.query.roles.split(','),
      },
    },
    attributes: fields?.length ? fields.split(',') : { exclude: ['password'] },
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
});
exports.sendMessageToUser = catchAsync(async (req, res) => {
  var config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      messaging_product: 'whatsapp',
      preview_url: false,
      recipient_type: 'individual',
      to: req.query.to,
      type: 'text',
      text: {
        body: req.body.text,
      },
    }),
  };

  const resp = await axios(config);
  res.status(200).json({
    status: 'success',
    ok: true,
    data: resp.data,
  });
});
exports.getUsersNextRecentBirthday = catchAsync(async (req, res) => {
  const fields = req.query.fields;
  let users = await User.findAll({
    where: {
      birthday: {
        [Op.ne]: null,
      },
    },
    attributes: fields?.length ? fields.split(',') : { exclude: ['password'] },
    order: [['birthday', 'asc']],
  });

  let todays = [];
  let tomorrows = [];
  var tomorrow = new Date();
  tomorrow.setTime(tomorrow.getTime() + 1 * 24 * 60 * 60 * 1000);

  users.map((user, i) => {
    if (user.birthday.slice(5, 10) === new Date().toISOString().slice(5, 10)) {
      user.when = 'Hoy';
      todays.push(user);
    } else if (user.birthday.slice(5, 10) === tomorrow.toISOString().slice(5, 10)) {
      user.when = 'Mañana';
      tomorrows.push(user);
    }
  });

  res.status(200).json({
    status: 'success',
    ok: true,
    results: [...todays, ...tomorrows].length,
    data: {
      todays,
      tomorrows,
    },
  });
});
