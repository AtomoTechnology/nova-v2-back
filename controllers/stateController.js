const { State } = require('../models');
const catchAsync = require('./../helpers/catchAsync');
const factory = require('./factoryController');
const exState = require('../models2/stateModel');

exports.migrateStates = async (req, res) => {
  let query = exState.find();
  const states = await query;
  // console.log(works);
  // return;
  states.forEach(async (state) => {
    // console.log(work.dni, '-', work.name, '-', work._id, '-', work._id.toString().replace(/"/, ''));
    // return;
    await State.create({
      name: state.name,
      uuid: state._id.toString().replace(/"/, ''),
    });
  });

  res.status(200).json({
    status: 'success',
    results: states.length,
    data: {
      states,
    },
  });
};

exports.create = factory.create(State, ['name']);
exports.all = factory.all(State);
exports.delete = factory.delete(State);
exports.update = factory.update(State, ['name']);
exports.DeleteAll = factory.deleteAll(State);
