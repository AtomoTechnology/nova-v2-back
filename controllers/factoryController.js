const AppError = require('../helpers/AppError');
const catchAsync = require('../helpers/catchAsync');
const EmailContact = require('../helpers/sendContactMail');

const filterField = (allFields, allowedFiels) => {
  var fields = {};

  Object.keys(allFields).forEach((field) => {
    if (allowedFiels.includes(field)) {
      fields[field] = allFields[field];
    }
  });

  return fields;
};

exports.create = (model, fieldsAllowed = null, action = null) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    filteredFields = { ...req.body };
    if (fieldsAllowed != null) {
      filteredFields = filterField(req.body, fieldsAllowed);
    }

    const doc = await model.create(filteredFields);
    console.log(doc.dataValues);

    if (action != null) {
      if (action.mail) {
        await new EmailContact(doc.dataValues).sendContact();
      }
    }

    res.status(201).json({
      status: 'success',
      ok: true,
      data: {
        data: doc,
      },
    });
  });

exports.all = (Model, options = null) =>
  catchAsync(async (req, res, next) => {
    if (options) {
      var { include } = options;
    }
    // console.log('innn');

    const docs = await Model.findAll({
      where: req.query,
      include: include,
      order: [
        // will return `name`
        ['createdAt', 'DESC'],
      ],
    });
    res.status(200).json({
      status: 'success',
      ok: true,
      results: docs.length,
      data: { data: docs },
    });
  });

// exports.all = (model, options = null) =>
//   catchAsync(async (req, res, next) => {
//     const docs = await model.findAll({ where: req.query });

//     res.status(200).json({
//       status: 'success',
//       results: docs.length,
//       data: {
//         data: docs,
//       },
//     });
//   });

exports.find = (model, options = null) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    console.log(req.body);
    if (options) {
      var { include } = options;
    }
    const doc = await model.findByPk(id, { include: include });
    if (!doc) return next(new AppError('No hay documento con ese ID!!!', 404));
    res.status(200).json({
      status: 'success',
      ok: true,
      data: {
        data: doc,
      },
    });
  });
exports.findByUuid = (model, options = null) =>
  catchAsync(async (req, res, next) => {
    console.log(req.query.uuid);
    if (options) {
      var { include } = options;
    }
    const doc = await model.findOne({ where: { uuid: req.query.uuid } }, { include: include });
    if (!doc) return next(new AppError('No hay documento con ese ID!!!', 404));
    res.status(200).json({
      status: 'success',
      ok: true,
      data: {
        data: doc,
      },
    });
  });

exports.update = (model, fieldsAllowed) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    if (!req.params.id) {
      return next(new AppError('Necesita un id para poder actualizar un documento', 401));
    }

    if (fieldsAllowed) {
      filteredFields = filterField(req.body, fieldsAllowed);
    }

    const doc = await model.update(filteredFields, {
      where: {
        id: req.params.id,
      },
    });
    console.log(doc);
    if (doc[0] === 0) return next(new AppError('No hay documento con ese ID!!!', 404));
    res.status(200).json({
      status: 'success',
      ok: true,
      message: 'Documento actualizado con exito',
      data: {
        data: doc,
      },
    });
  });

exports.delete = (model) =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id) {
      return next(new AppError('Necesitas un id para poder borrar un documento', 401));
    }

    const doc = await model.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!doc) return next(new AppError('No hay documento con ese ID!!!', 404));
    res.status(200).json({
      status: 'success',
      ok: true,
      data: null,
    });
  });

exports.deleteAll = (model) =>
  catchAsync(async (req, res, next) => {
    await model.destroy({ truncate: true });
    res.status(200).json({
      status: 'success',
      ok: true,
      data: null,
    });
  });
