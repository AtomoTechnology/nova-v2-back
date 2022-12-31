const factory = require('./factoryController');
const { Product } = require('../models');
const catchAsync = require('../helpers/catchAsync');
const { cloudinary } = require('../helpers/cloudinary');

// exports.create = factory.create(Product);
exports.all = factory.all(Product);
exports.delete = catchAsync(async (req, res, next) => {
  const ids = JSON.parse(req.body.photos)
    .split(',')
    .map((p) => p.split('/')[p.split('/').length - 2] + '/' + p.split('/').pop().split('.')[0]);

  if (ids.length) {
    const resp = await cloudinary.api.delete_resources(ids);
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
  }

  res.status(200).json({
    ok: true,
    sucsess: 'success',
    data: null,
  });
});

exports.update = factory.update(Product, [
  'model',
  'trademark',
  'price',
  'description',
  'photo',
  'trademark',
  'colours',
  'stock',
  'state',
  'storage',
]);
exports.DeleteAll = factory.deleteAll(Product);

exports.create = catchAsync(async (req, res, next) => {
  const r = [];
  for (let index = 0; index < req.body.photos.length; index++) {
    await cloudinary.uploader.upload(
      req.body.photos[index],
      {
        upload_preset: 'NovaTech',
      },
      function (error, result) {
        if (error) {
          return res.status(500).json({
            ok: false,
            msg: 'Error al guardar la imagen!',
          });
        }

        // let partial = {
        //   // public_id: result.public_id,
        //   url: result.url,
        // };

        r.push(result.url);
      }
    );
  }

  req.body.photos = `${r}`;

  const product = await Product.create(req.body);
  res.status(201).json({
    ok: true,
    data: {
      product,
    },
  });
});
