const { Schema, model } = require('mongoose');
const StateSchema = Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = model('State', StateSchema);
