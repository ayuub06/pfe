const Schedule = require('../models/Schedule');
const Module = require('../models/Module');
const Room = require('../models/Room');
const User = require('../models/User');
const Exam = require('../models/Exam');

// Manual schedule exam
exports.scheduleExam = async (req, res) => {
  try {
    const { moduleId, date, heure_debut, heure_fin, salleId, superviseurIds } = req.body;
    
    console.log('📝 Manual scheduling request:', { moduleId, date, heure_debut, heure_fin, salleId, superviseurIds });
    
    // Validate inputs
    if (!moduleId || !date || !heure_debut || !heure_fin || !salleId || !superviseurIds || superviseurIds.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Get module
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Get room
    const room = await Room.findById(salleId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check room conflict
    const roomConflict = await Schedule.findOne({
      salle: salleId,
      date: new Date(date),
      $or: [
        { heure_debut: { $lt: heure_fin }, heure_fin: { $gt: heure_debut } }
      ]
    });
    
    if (roomConflict) {
      return res.status(400).json({ message: 'Room already booked for this time' });
    }
    
    // Check supervisor conflicts
    for (const supervisorId of superviseurIds) {
      const supervisorConflict = await Schedule.findOne({
        superviseurs: supervisorId,
        date: new Date(date),
        $or: [
          { heure_debut: { $lt: heure_fin }, heure_fin: { $gt: heure_debut } }
        ]
      });
      
      if (supervisorConflict) {
        return res.status(400).json({ message: 'Supervisor already assigned to another exam' });
      }
    }
    
    // Create exam
    const exam = new Exam({
      module: module.name,
      code_module: module.code,
      date: new Date(date),
      heure_debut,
      heure_fin,
      salle: salleId,
      surveillant: superviseurIds[0],
      etudiants: [],
      type: 'exam',
      nombre_etudiants: room.capacite,
      department: module.department,
      semester: module.semester
    });
    
    await exam.save();
    console.log('✅ Exam created:', exam._id);
    
    // Create schedule
    const schedule = new Schedule({
      exam: exam._id,
      module: module._id,
      department: module.department,
      date: new Date(date),
      heure_debut,
      heure_fin,
      salle: salleId,
      superviseurs: superviseurIds,
      type: 'principal'
    });
    
    await schedule.save();
    console.log('✅ Schedule created:', schedule._id);
    
    res.json({ success: true, message: 'Exam scheduled successfully', exam });
    
  } catch (error) {
    console.error('Error in scheduleExam:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Auto generate schedule
exports.autoGenerateSchedule = async (req, res) => {
  try {
    const { year, month } = req.body;
    
    console.log('🎯 Auto-generating schedule...');
    
    // Clear existing
    await Schedule.deleteMany({});
    await Exam.deleteMany({});
    
    // Get all modules
    const modules = await Module.find({});
    console.log(`Found ${modules.length} modules`);
    
    if (modules.length === 0) {
      return res.status(400).json({ message: 'No modules found' });
    }
    
    // Get rooms
    const rooms = await Room.find({ isActive: true });
    console.log(`Found ${rooms.length} rooms`);
    
    if (rooms.length === 0) {
      return res.status(400).json({ message: 'No rooms found' });
    }
    
    // Get professors
    const professors = await User.find({ role: 'professeur' });
    console.log(`Found ${professors.length} professors`);
    
    if (professors.length === 0) {
      return res.status(400).json({ message: 'No professors found' });
    }
    
    const results = {
      scheduled: [],
      failed: []
    };
    
    // Time slots
    const timeSlots = [
      { start: '08:00', end: '10:00' },
      { start: '10:30', end: '12:30' },
      { start: '14:00', end: '16:00' },
      { start: '16:30', end: '18:30' }
    ];
    
    // Track used resources
    const usedRooms = {};
    const usedSupervisors = {};
    
    const isAvailable = (roomId, supervisorIds, date, slot) => {
      const dateStr = date.toDateString();
      const slotKey = `${slot.start}-${slot.end}`;
      if (usedRooms[`${dateStr}_${roomId}_${slotKey}`]) return false;
      for (const supId of supervisorIds) {
        if (usedSupervisors[`${dateStr}_${supId}_${slotKey}`]) return false;
      }
      return true;
    };
    
    const markUsed = (roomId, supervisorIds, date, slot) => {
      const dateStr = date.toDateString();
      const slotKey = `${slot.start}-${slot.end}`;
      usedRooms[`${dateStr}_${roomId}_${slotKey}`] = true;
      for (const supId of supervisorIds) {
        usedSupervisors[`${dateStr}_${supId}_${slotKey}`] = true;
      }
    };
    
    const getRequiredSupervisors = (room) => {
      if (room.nom && room.nom.toLowerCase().includes('amphi')) return 3;
      if (room.capacite >= 40) return 2;
      return 1;
    };
    
    const getAvailableProfessors = (date, slot, requiredCount) => {
      const dateStr = date.toDateString();
      const slotKey = `${slot.start}-${slot.end}`;
      const available = [];
      for (const prof of professors) {
        if (!usedSupervisors[`${dateStr}_${prof._id}_${slotKey}`]) {
          available.push(prof);
        }
        if (available.length >= requiredCount) break;
      }
      return available;
    };
    
    // Process each module
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      
      // Choose room
      let room = rooms[0];
      if (module.department === 'COMMON') {
        room = rooms.find(r => r.nom && r.nom.toLowerCase().includes('amphi')) || rooms[0];
      } else if (module.department === 'GI') {
        const largeRooms = rooms.filter(r => r.capacite >= 40 && !r.nom?.toLowerCase().includes('amphi'));
        room = largeRooms[i % largeRooms.length] || rooms[0];
      } else {
        const smallRooms = rooms.filter(r => r.capacite < 40);
        room = smallRooms[i % smallRooms.length] || rooms[0];
      }
      
      const requiredSupervisors = getRequiredSupervisors(room);
      
      // Choose date
      let date;
      if (module.semester === 'S6') {
        const day = Math.floor(Math.random() * 15) + 16;
        date = new Date(2025, 0, day);
      } else {
        const day = Math.floor(Math.random() * 15) + 1;
        date = new Date(2025, 0, day);
      }
      
      let slotIndex = Math.floor(Math.random() * timeSlots.length);
      let slot = { ...timeSlots[slotIndex] };
      let found = false;
      
      for (let attempt = 0; attempt < timeSlots.length * 2; attempt++) {
        const availableProfs = getAvailableProfessors(date, slot, requiredSupervisors);
        if (availableProfs.length >= requiredSupervisors && isAvailable(room._id, availableProfs.map(p => p._id), date, slot)) {
          // Create exam
          const exam = new Exam({
            module: module.name,
            code_module: module.code,
            date: date,
            heure_debut: slot.start,
            heure_fin: slot.end,
            salle: room._id,
            surveillant: availableProfs[0]._id,
            etudiants: [],
            type: 'exam',
            nombre_etudiants: room.capacite,
            department: module.department,
            semester: module.semester
          });
          await exam.save();
          
          // Create schedule
          const schedule = new Schedule({
            exam: exam._id,
            module: module._id,
            department: module.department,
            date: date,
            heure_debut: slot.start,
            heure_fin: slot.end,
            salle: room._id,
            superviseurs: availableProfs.map(p => p._id),
            type: 'principal'
          });
          await schedule.save();
          
          markUsed(room._id, availableProfs.map(p => p._id), date, slot);
          
          results.scheduled.push({
            module: module.name,
            code: module.code,
            date: date.toLocaleDateString(),
            time: `${slot.start} - ${slot.end}`,
            room: room.nom,
            supervisors: availableProfs.map(p => `${p.name} ${p.prenom}`).join(', ')
          });
          
          found = true;
          break;
        }
        slotIndex = (slotIndex + 1) % timeSlots.length;
        slot = { ...timeSlots[slotIndex] };
      }
      
      if (!found) {
        results.failed.push({ module: module.name, reason: 'No available slot' });
      }
    }
    
    res.json({ 
      success: true, 
      results: {
        scheduled: results.scheduled,
        failed: results.failed,
        totalScheduled: results.scheduled.length,
        totalFailed: results.failed.length,
        conflicts: []
      }
    });
    
  } catch (error) {
    console.error('Error in autoGenerateSchedule:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Check availability
exports.checkAvailability = async (req, res) => {
  try {
    const { date, heure_debut, heure_fin, salleId, supervisorId } = req.body;
    const conflicts = { room: null, supervisor: null };
    
    if (salleId) {
      conflicts.room = await Schedule.findOne({
        salle: salleId,
        date: new Date(date),
        $or: [{ heure_debut: { $lt: heure_fin }, heure_fin: { $gt: heure_debut } }]
      });
    }
    
    if (supervisorId) {
      conflicts.supervisor = await Schedule.findOne({
        superviseurs: supervisorId,
        date: new Date(date),
        $or: [{ heure_debut: { $lt: heure_fin }, heure_fin: { $gt: heure_debut } }]
      });
    }
    
    res.json({ available: !conflicts.room && !conflicts.supervisor, conflicts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};