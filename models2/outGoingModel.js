const { Schema, model } = require('mongoose');
const OutgoingsSchema = Schema({
  description: {
    type: String,
    required: [true, 'Es obligatorio una descripcion'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: [true, 'Hay que especificar un monto'],
  },
});

OutgoingsSchema.pre(/^find/, function (next) {
  this.sort('-date');
  next();
});

module.exports = model('Outgoing', OutgoingsSchema);
