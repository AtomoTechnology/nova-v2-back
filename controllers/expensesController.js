const catchAsync = require('../helpers/catchAsync');
const { Expense } = require('../models');
const factory = require('./factoryController');
const { Op } = require('sequelize');

exports.create = factory.create(Expense, ['description', 'amount']);
exports.find = factory.find(Expense);
exports.delete = factory.delete(Expense);
exports.deleteAll = factory.deleteAll(Expense);
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
  });

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs,
    },
  });
});
