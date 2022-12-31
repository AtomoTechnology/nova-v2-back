const catchAsync = require('../helpers/catchAsync');
const { Sell, User, Product } = require('../models');
const factory = require('./factoryController');
const { Op } = require('sequelize');

exports.create = factory.create(Sell, [
  'state',
  'observaciones',
  'sellerId',
  'ProductId',
  'UserId',
  'providerId',
  'precio',
]);
exports.update = factory.update(Sell, [
  'state',
  'observaciones',
  'sellerId',
  'ProductId',
  'UserId',
  'providerId',
  'precio',
]);
exports.find = factory.find(Sell, {
  include: [
    { model: User, attributes: ['name', 'uuid', 'photo', 'id', 'dni'] },
    { model: User, as: 'seller', attributes: ['name', 'uuid', 'photo', 'id', 'dni'] },
    { model: User, as: 'provider', attributes: ['name', 'uuid', 'photo', 'id', 'dni'] },
    { model: Product },
  ],
});
exports.delete = factory.delete(Sell);
exports.deleteAll = factory.deleteAll(Sell);
exports.all = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const docs = await Sell.findAll({
    where: {
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    },
    include: [
      { model: User, attributes: ['name', 'uuid', 'photo', 'id', 'dni'] },
      { model: User, as: 'seller', attributes: ['name', 'uuid', 'photo', 'id', 'dni'] },
      { model: User, as: 'provider', attributes: ['name', 'uuid', 'photo', 'id', 'dni'] },
      { model: Product },
    ],
    attributes: req.query.fields ? req.query.fields.split(',') : { exclude: [] },
    order: [['createdAT', 'desc']],
  });

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs,
    },
  });
});
