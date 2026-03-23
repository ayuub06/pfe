const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
  },
  code_module: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  heure_debut: {
    type: String,
    required: true,
  },
  heure_fin: {
    type: String,
    required: true,
  },
  salle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  surveillant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  etudiants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  type: {
    type: String,
    enum: ['exam', 'quiz', 'final', 'midterm'],
    default: 'exam',
  },
  nombre_etudiants: {
    type: Number,
    required: true,
  },
  notes: [{
    etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: Number, min: 0, max: 20 },
    present: { type: Boolean, default: false },
  }],
  department: {
    type: String,
    enum: ['GI', 'IDS', 'COMMON'],
    default: 'COMMON'
  },
  semester: {
    type: String,
    enum: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    default: 'S1'
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Exam', examSchema);