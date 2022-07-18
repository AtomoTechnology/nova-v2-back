const { State, Work } = require('../models');
const factory = require('./factoryController');

exports.create = factory.create(State, ['name']);
exports.all = factory.all(State);
exports.delete = factory.delete(State);
exports.update = factory.update(State, ['name']);
exports.DeleteAll = factory.deleteAll(State);
