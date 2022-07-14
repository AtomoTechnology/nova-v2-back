const catchAsync = require('../helpers/catchAsync');
const { Expense } = require('../models');
const factory = require('./factoryController');
const moment = require('moment');
const { Op } = require('sequelize');
const exExpense = require('../models2/outGoingModel');

exports.migrate = async (req, res) => {
  let query = exExpense.find();
  const expenses = await query;
  // console.log(works);
  // return;
  expenses.forEach(async (exp) => {
    await Expense.create({
      description: exp.description,
      amount: exp.amount,
      createdAt: exp.date,
      updatedAt: new Date(),
    });
  });

  res.status(200).json({
    status: 'success',
    results: expenses.length,
    data: {
      expenses,
    },
  });
};

exports.create = factory.create(Expense, ['description', 'amount']);
exports.find = factory.find(Expense);
exports.delete = factory.delete(Expense);
exports.deleteAll = factory.deleteAll(Expense);
// exports.all = factory.all(Expense);

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
