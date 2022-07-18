const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const { Query } = require('../models');
const factory = require('./factoryController');

exports.UpdateRead = factory.update(Query, ['read']);
exports.Delete = factory.delete(Query);
exports.GetById = factory.find(Query);

exports.GetAll = catchAsync(async (req, res, next) => {
  let query = {};
  if (req.user?.role === 'user') {
    // query = { user: req.user._id };
    req.query.user = req.user._id;
  }

  const docs = await Query.findAll(req.query);
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.Create = catchAsync(async (req, res, next) => {
  const query = await Query.create({
    message: req.body.message,
    UserId: req.user.uuid,
  });

  res.status(201).json({
    status: 'success',
    data: {
      query,
    },
  });
});

exports.ResponseQuery = catchAsync(async (req, res, next) => {
  const idQuery = req.params.id;
  const query = await Query.findByPk(idQuery, { raw: true });
  if (!query) return next(new AppError('No hay consultas con ese id', 400));

  const response = {};
  response.message = req.body.message;
  response.user = req.user.uuid;
  response.date = new Date();
  if (query.responses === null) {
    query.responses = [];
  }
  query.responses.push(response);

  const querySave = await Query.update(
    { responses: query.responses },
    {
      where: {
        id: query.id,
      },
    }
  );

  res.status(201).json({
    status: 'success',
    data: {
      query: querySave,
    },
  });
});
