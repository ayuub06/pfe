const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    enum: ['GI', 'IDS', 'COMMON'], // Add 'COMMON' here
    required: true
  },
  semester: {
    type: String,
    enum: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    required: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hours: {
    type: Number,
    default: 30
  },
  credits: {
    type: Number,
    default: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Module', moduleSchema);