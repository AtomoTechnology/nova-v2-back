const { Work, User, State: st, WorksState } = require('../models');
const { generateCodigoWork } = require('../helpers/generateCodigoWork');
const moment = require('moment');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/AppError');
const path = require('path');
const os = require('os');
const factory = require('./factoryController');
const { Op } = require('sequelize');

exports.createWork = catchAsync(async (req, res, next) => {
  const newWork = new Work(req.body);
  do {
    newWork.codigo = generateCodigoWork();
  } while (await Work.findOne({ where: { codigo: newWork.codigo }, limit: 1 }));

  const work = await newWork.save(newWork);

  await WorksState.create({
    WorkId: work.uuid,
    StateId: newWork.StateId,
  });

  res.status(201).json({
    status: 'success',
    ok: true,
  });
});

exports.getAllWorks = factory.all(Work, {
  include: [
    { model: User, attributes: ['name', 'photo'] },
    { model: st, attributes: ['name'] },
    {
      model: WorksState,
      as: 'states',
      attributes: ['date'],
      include: [{ model: st, attributes: ['name'] }],
    },
  ],
  attributes: [
    'codigo',
    'id',
    'uuid',
    'marca',
    'modelo',
    'total',
    'observaciones',
    'tieneContrasena',
    'contrasena',
    'patron',
    'esPatron',
  ],
});

exports.all = catchAsync(async (req, res, next) => {
  let totalPage = 1;
  let page = 1;
  let limit = 1;
  let skip = 0;
  if (req.query.limit && req.query.page) {
    page = req.query.page * 1 || 1;
    limit = req.query.limit * 1 || 30;
    skip = (page - 1) * limit;
  }

  const docs = await Work.findAndCountAll({
    // where: req.query,
    include: [
      { model: st, attributes: ['name'] },
      { model: User, attributes: ['name', 'photo'] },
    ],
    order: [
      ['createdAt', 'DESC'],
      ['codigo', 'DESC'],
    ],
    attributes: [
      'codigo',
      'id',
      'uuid',
      'marca',
      'modelo',
      'total',
      'observaciones',
      'tieneContrasena',
      'contrasena',
      'patron',
      'esPatron',
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
      works: docs.rows,
    },
  });
});

exports.find = factory.find(Work, {
  include: [
    { model: User, attributes: ['name', 'photo', 'dni', 'phone1', 'uuid'] },
    { model: st, attributes: ['name'] },
    {
      model: WorksState,
      as: 'states',
      attributes: ['date'],
      include: [{ model: st, attributes: ['name'] }],
    },
    // {
    //   model: st,
    //   as: 'states',
    //   attributes: ['name'],
    //   order: [['createdAt', 'DESC']],
    //   through: {
    //     attributes: ['date'],
    //   },
    // },
  ],
});

exports.updateWork = catchAsync(async (req, res, next) => {
  const workId = req.params.id;
  const work = await Work.findByPk(workId);
  if (!work) return next(new AppError('No se encontró trabajo con ese id', 404));
  const newWork = { ...req.body };
  const stateToModify = await st.findOne({ where: { uuid: newWork.StateId } });
  if (stateToModify != null) {
    if (stateToModify.name === 'Entregado') {
      newWork.fechaFin = moment.now();
    }
  }
  await Work.update(newWork, { where: { id: workId } });

  if (work.StateId != newWork.StateId) {
    await WorksState.create({
      WorkId: work.uuid,
      StateId: newWork.StateId,
    });
  }

  res.status(200).json({
    status: 'success',
    ok: true,
  });
});

exports.deleteWork = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError('Necesitas un id para poder borrar un documento', 401));
  }

  const work = await Work.findByPk(req.params.id);
  if (!work) return next(new AppError('No se encontró trabajo con ese id', 404));

  await WorksState.destroy({
    where: {
      WorkId: work.uuid,
    },
  });

  const doc = await Work.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    status: 'success',
    ok: true,
    data: null,
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Work.deleteMany();

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.DownloadOrder = catchAsync(async (req, res, next) => {
  res.sendFile(`${path.join(os.homedir(), 'downloads')}/order.pdf`);
});

exports.UpdateStatesToArray = catchAsync(async (req, res, next) => {
  const formerStates = await Work_State.find();
  res.status(200).json({
    status: 'success',
    res: formerStates.length,
  });
});

exports.getWorksByDataAndTurnedinState = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.body;
  console.log(startDate, endDate);
  const state = await st.findOne({ where: { name: 'Entregado' } });
  const works = await Work.findAll({
    where: {
      StateId: state.uuid,
      fechaFin: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    },
    order: [['fechaFin', 'DESC']],
    attributes: ['fechaFin', 'marca', 'modelo', 'codigo', 'precio', 'total', 'id', 'uuid'],
  });

  res.status(200).json({
    status: 'success',
    results: works.length,
    data: {
      data: works,
    },
  });
});
