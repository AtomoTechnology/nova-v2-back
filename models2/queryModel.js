const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: [true, 'Tienes que ser un usuario para poder hacer una consulta'],
  },
  message: {
    type: String,
    required: [true, 'Hay que escribir un mensaje para la consulta'],
    maxlength: [200, 'POdes escribir hasta 200 caracteres.'],
  },
  responses: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      message: {
        type: String,
        required: [true, 'Hay que escribir un mensaje para la consulta'],
        maxlength: [200, 'POdes escribir hasta 200 caracteres.'],
      },
      user: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Tienes que ser un usuario para poder hacer una consulta'],
      },
    },
  ],
  read: {
    type: Boolean,
    default: false,
  },
});

// querySchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user',
//   });
//   next();
// });

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
