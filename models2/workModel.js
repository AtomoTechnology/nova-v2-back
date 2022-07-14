const { Schema, model } = require('mongoose');
const moment = require('moment');

const WorkSchema = Schema({
  codigo: {
    type: String,
    required: [true, 'EL codigo es obligatorio.'],
  },
  marca: {
    type: String,
    required: [true, 'La marca  es obligatoria.'],
  },
  modelo: {
    type: String,
    required: [true, 'El modelo  es obligatoria.'],
  },
  emei: {
    type: String,
  },
  fachasEncontradas: {
    type: String,
  },
  observaciones: {
    type: String,
    required: [true, 'Es obligatorio una observaciones.'],
  },
  descripcion: {
    type: String,
  },
  estado: {
    type: Schema.Types.ObjectId,
    ref: 'State',
    required: [true, 'El estado es obligatorio'],
  },

  states: [
    {
      nombre: String,
      fecha: {
        type: Date,
        default: Date,
      },
    },
  ],
  recargo: {
    type: Number,
    default: 0,
  },

  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio '],
  },
  total: {
    type: Number,
  },
  descuento: {
    type: Number,
    default: 0,
  },
  fechaInicio: {
    type: Date,
    // required: true,
    default: Date.now,
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, ' Es obligatorio el cliente'],
  },
  fechaFin: {
    type: Date,
  },
  images: [],

  contrasena: {
    type: String,
  },
  patron: {
    type: String,
  },
  esPatron: {
    type: Boolean,
  },
  tieneContrasena: {
    type: Boolean,
  },
});

module.exports = model('Work', WorkSchema);
