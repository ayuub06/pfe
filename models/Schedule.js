const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  department: {
    type: String,
    enum: ['GI', 'IDS', 'COMMON'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  heure_debut: {
    type: String,
    required: true
  },
  heure_fin: {
    type: String,
    required: true
  },
  salle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  superviseurs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  type: {
    type: String,
    enum: ['principal', 'rattrapage'],
    default: 'principal'
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed'],
    default: 'scheduled'
  }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);