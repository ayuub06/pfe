const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get all modules (admin) or professor's modules
router.get('/', authMiddleware, async (req, res) => {
  try {
    let modules = [];
    if (req.user.role === 'admin') {
      modules = await Module.find().populate('professor', 'name prenom email');
    } else if (req.user.role === 'professeur') {
      modules = await Module.find({ professor: req.user._id }).populate('professor', 'name prenom email');
    }
    res.json({ success: true, modules });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create module (admin only)
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { name, code, department, semester, professor, hours, credits } = req.body;
    const existingModule = await Module.findOne({ code });
    if (existingModule) {
      return res.status(400).json({ message: 'Module code already exists' });
    }
    const module = new Module({ name, code, department, semester, professor, hours, credits });
    await module.save();
    const populatedModule = await Module.findById(module._id).populate('professor', 'name prenom');
    res.status(201).json({ success: true, module: populatedModule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;