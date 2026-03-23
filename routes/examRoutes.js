const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { authMiddleware } = require('../middleware/auth');

// Get exams based on user role
router.get('/', authMiddleware, async (req, res) => {
  try {
    let exams = [];
    
    if (req.user.role === 'admin') {
      // Admin sees all exams
      exams = await Exam.find()
        .populate('salle', 'nom capacite')
        .populate('surveillant', 'name prenom')
        .sort({ date: 1, heure_debut: 1 });
    } 
    else if (req.user.role === 'professeur') {
      // Professor sees exams they supervise
      exams = await Exam.find({ surveillant: req.user._id })
        .populate('salle', 'nom capacite')
        .populate('surveillant', 'name prenom')
        .sort({ date: 1, heure_debut: 1 });
    } 
    else if (req.user.role === 'etudiant') {
      // Student sees exams they are enrolled in
      exams = await Exam.find({ etudiants: req.user._id })
        .populate('salle', 'nom capacite')
        .populate('surveillant', 'name prenom')
        .sort({ date: 1, heure_debut: 1 });
      
      console.log(`Student ${req.user.email}: found ${exams.length} exams`);
    }
    
    res.json({ success: true, exams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;