const catchAsync = require('../helpers/catchAsync');
const { Expense } = require('../models');
const factory = require('./factoryController');
const { Op } = require('sequelize');

exports.create = factory.create(Expense, ['description', 'amount', 'category', 'type']);
exports.find = factory.find(Expense);
exports.delete = factory.delete(Expense);
exports.deleteAll = factory.deleteAll(Expense);

// solucionarlo que no se pida los minutos
exports.all = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const docs = await Expense.findAll({
    where: {
      createdAt: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    },
    order: [['createdAt', 'desc']],
  });

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs,
    },
  });
});
