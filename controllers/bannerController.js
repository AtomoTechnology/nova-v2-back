const catchAsync = require('../helpers/catchAsync');
const { Banner } = require('../models');
const factory = require('./factoryController');

exports.all = factory.all(Banner);
exports.delete = factory.delete(Banner);

exports.create = catchAsync(async (req, res, next) => {
  for (let i = 0; i < req.body.photos.length; i++) {
    await Banner.create(req.body.photos[i]);
  }

  res.json({
    status: 'success',
  });
});
