const State = require('../models2/stateModel');
const { Work, User, State: st } = require('../models');
const exWork = require('../models2/workModel');
const { generateCodigoWork } = require('../helpers/generateCodigoWork');
const moment = require('moment');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/AppError');
const pdf = require('html-pdf');
const path = require('path');
const os = require('os');
const factory = require('./factoryController');
const templatePdf = require('../helpers/TemplatePdf');
const { Op } = require('sequelize');
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.createWork = catchAsync(async (req, res, next) => {
  const newWork = new Work(req.body);
  newWork.states = [];
  console.log(newWork);
  do {
    newWork.codigo = generateCodigoWork();
  } while (await Work.findOne({ where: { codigo: newWork.codigo }, limit: 1 }));

  const state = await st.findOne({ where: { uuid: newWork.StateId } });
  console.log(state.name);
  newWork.states.push({ nombre: state.name, fecha: new Date() });

  const work = await newWork.save();
  res.status(201).json({
    status: 'success',
    data: {
      work,
    },
  });
});

exports.migrateWorks = async (req, res) => {
  let query = exWork.find();
  const works = await query;
  // console.log(works);
  // return;
  works.forEach(async (work) => {
    // console.log(work.dni, '-', work.name, '-', work._id, '-', work._id.toString().replace(/"/, ''));
    // return;
    await Work.create({
      marca: work.marca,
      uuid: work._id.toString().replace(/"/, ''),
      modelo: work.modelo,
      emei: work.emei,
      StateId: work.estado,
      recargo: work.recargo,
      descuento: work.descuento,
      precio: work.precio,
      fachasEncontradas: work.fachasEncontradas,
      observaciones: work.observaciones,
      descripcion: work.descripcion,
      UserId: work.cliente.toString().replace(/"/, ''),
      createdAt: work.fechaInicio,
      fechaFin: work.fechaFin,
      tieneContrasena: work.tieneContrasena,
      esPatron: work.esPatron,
      contrasena: work.contrasena,
      patron: work.patron,
      codigo: work.codigo,
      total: work.total,
      states: work.states,
    });
  });

  res.status(200).json({
    status: 'success',
    results: works.length,
    data: {
      works,
    },
  });
};

exports.getAllWorks = factory.all(Work, { include: [{ model: User }, { model: st }] });
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
    include: [{ model: st }, { model: User }],
    order: [
      ['createdAt', 'DESC'],
      ['codigo', 'DESC'],
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

exports.GetWorkByCode = catchAsync(async (req, res, next) => {
  const work = await Work.find({ codigo: { $regex: '.*' + req.body.codigo + '.*' } }).populate({
    path: 'estado',
    select: '-__v',
  });

  if (!work) return next(new AppError('No se encontró trabajo con ese codigo..', 400));

  res.status(200).json({
    status: 'success',
    work,
  });
});

exports.find = factory.find(Work, { include: [{ model: User }, { model: st }] });

exports.getWorksClient = catchAsync(async (req, res, next) => {
  const idClient = req.params.idClient;

  const works = await Work.find({ cliente: idClient })
    .populate({
      path: 'cliente',
      select: 'name',
    })
    .populate({
      path: 'estado',
      select: '-__v',
    })
    .sort('-fechaInicio');

  if (!works) return next(new AppError('No existe usuario con ese ID', 500));
  // if (works.length === 0) return next(new AppError('No se encontró trabajo para es usuario', 204));

  res.status(200).json({
    status: 'success',
    results: works.length,
    data: {
      works,
    },
  });
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
  if (work.StateId != newWork.StateId) {
    work.states.push({ nombre: stateToModify.name, fecha: new Date() });
    newWork.states = work.states;
  }
  await Work.update(newWork, { where: { id: workId } });

  res.status(200).json({
    status: 'success',
    ok: true,
  });
});

exports.deleteWork = factory.delete(Work);

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

exports.ConfirmWork = catchAsync(async (req, res, next) => {
  const state = await State.findOne({ name: 'Terminado' });
  const confirmWork = await Work.find({ estado: state._id });

  res.status(200).json({
    status: 'success',
    results: confirmWork.length,
    data: {
      works: confirmWork,
    },
  });
});

exports.WorkStats = catchAsync(async (req, res, next) => {
  const stats = await Work.aggregate([
    {
      $group: {
        _id: '',
        quantity: { $sum: 1 },
        averageEarn: { $avg: '$total' },
        minPrice: { $min: '$total' },
        maxPrice: { $max: '$total' },
        totalEarned: { $sum: '$total' },
      },
    },
  ]);
  // stats = await stats.populate( { path: 'estado' });

  res.status(200).json({
    status: 'success',
    data: {
      data: stats,
    },
  });
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
  });
  // $gte: moment(startDate).toDate(), $lte: moment(endDate).add(1, 'days').toDate()
  // .sort('-fechaFin')
  // .select('fechaFin marca modelo codigo precio total');

  res.status(200).json({
    status: 'success',
    results: works.length,
    data: {
      data: works,
    },
  });
});

// const updateStateWork = async (req, res, next) => {
//   // get the id form the url
//   const workId = req.params.id;

//   try {
//     //get the work by id
//     const work = await Work.findById(workId);
//     // console.log(work);
//     if (!work) {
//       return res.status(404).json({
//         ok: false,
//         msg: 'no se encontró trabajo con ese id..',
//       });
//     }
//     const newWork = { ...req.body };
//     const stateToModify = await State.findById(newWork.estado);
//     if (stateToModify != null) {
//       console.log(stateToModify, moment.now());
//       if (stateToModify.name === 'Entregado') {
//         newWork.fechaFin = moment.now();
//       }
//     }
//     // console.log(newWork);

//     let descuento = (parseInt(newWork.precio) * parseInt(newWork.descuento)) / 100;
//     let recargo = (parseInt(newWork.precio) * parseInt(newWork.recargo)) / 100;
//     newWork.total = parseInt(newWork.precio) + recargo - descuento;

//     const updateWork = await Work.findByIdAndUpdate(workId, newWork, {
//       new: true,
//     }).populate('cliente estado');
//     console.log('update work');
//     console.log(updateWork);

//     if (work.estado != newWork.estado) {
//       const wsu = await Work_State.findOne({ work: workId }).limit(1);
//       wsu.state.push({ nombre: updateWork.estado.name, fecha: Date() });
//       await Work_State.findByIdAndUpdate(wsu._id, wsu, {
//         new: true,
//       });
//     }

//     res.status(201).json({
//       ok: true,
//       updateWork,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: 'habla con el administrador ',
//     });
//   }
// };

// const loadFile = (req, res = response) => {
//   if (req.files === null || req.files === undefined) {
//     return res.json({
//       ok: false,
//       msg: 'hubo un problema al subir la imagen',
//       files: req.files,
//     });
//   }
//   const imagenes = req.files.files;
//   console.log(imagenes.length, typeof imagenes);
//   if (imagenes.length >= 2) {
//     for (let index = 0; index < imagenes.length; index++) {
//       imagenes[index].name =
//         new Date().getTime() +
//         Math.floor(Math.random() * (1000 - 9999) + 9999) +
//         imagenes[index].name;
//     }
//     const imagenFormat = [];
//     const url = 'C:/works/JHMesseroux/Desktop/NicoProject/taller-nico/public/assets/img/works/';

//     if (!fs.existsSync(url)) {
//       // console.log(" no existe...");
//       fs.mkdirSync(url, 0744);
//     }

//     for (let index = 0; index < imagenes.length; index++) {
//       let img = {
//         fileName: imagenes[index].name,
//         filePath: `${url}${imagenes[index].name}`,
//         fileSize: imagenes[index].size,
//         fileMineType: imagenes[index].mineyype,
//       };

//       imagenes[index].mv(`${url}${imagenes[index].name}`, (err) => {
//         if (err) {
//           console.log(err);
//           return res.status(400).json({
//             err,
//             msg: 'No se pudo subir la imagen',
//           });
//         }
//       });

//       imagenFormat.push(img);
//     }
//     return res.json({
//       ok: true,
//       msg: 'imagenes subidos con existos',
//       imagenFormat,
//     });
//   } else {
//     return res.json({
//       ok: true,
//     });
//   }
// };

// const uploadImagenWork = async (req, res = response) => {
//   try {
//     // console.log(req.body);
//     const r = [];
//     for (let index = 0; index < req.body.length; index++) {
//       const resp = await cloudinary.uploader.upload(
//         req.body[index],
//         {
//           upload_preset: 'NovaTech',
//         },
//         function (error, result) {
//           if (error) {
//             return res.status(500).json({
//               ok: false,
//               msg: 'Error al guardar la imagen!',
//             });
//           }
//           console.log(result);

//           let partial = {
//             public_id: result.public_id,
//             format: result.format,
//             size: result.bytes,
//             url: result.url,
//           };
//           r.push(partial);
//         }
//       );
//     }

//     res.status(201).json({
//       ok: true,
//       pathImg: r,
//     });
//   } catch (error) {}
// };
