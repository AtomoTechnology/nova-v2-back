const factory = require('./factoryController');
const { Product } = require('../models');

exports.create = factory.create(Product);
exports.all = factory.all(Product);
exports.delete = factory.delete(Product);
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
