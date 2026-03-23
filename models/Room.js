 
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  capacite: {
    type: Number,
    required: true,
    min: 1,
  },
  batiment: {
    type: String,
    required: true,
  },
  etage: {
    type: Number,
    required: true,
  },
  equipment: {
    type: [String],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);