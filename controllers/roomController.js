const Room = require('../models/Room');
const Exam = require('../models/Exam');

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { nom, capacite, batiment, etage, equipment } = req.body;
    
    // Check if room already exists
    const existingRoom = await Room.findOne({ nom });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }
    
    const room = new Room({
      nom,
      capacite,
      batiment,
      etage,
      equipment: equipment || []
    });
    
    await room.save();
    res.status(201).json({ 
      success: true, 
      message: 'Room created successfully', 
      room 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true }).sort({ batiment: 1, etage: 1, nom: 1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const { nom, capacite, batiment, etage, equipment } = req.body;
    
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { nom, capacite, batiment, etage, equipment },
      { new: true, runValidators: true }
    );
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Room updated successfully', 
      room 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete room (soft delete)
exports.deleteRoom = async (req, res) => {
  try {
    // Check if room has upcoming exams
    const upcomingExams = await Exam.findOne({
      salle: req.params.id,
      date: { $gte: new Date() },
      status: { $ne: 'completed' }
    });
    
    if (upcomingExams) {
      return res.status(400).json({ 
        message: 'Cannot delete room with upcoming exams. Please reschedule exams first.' 
      });
    }
    
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Room deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check room availability
exports.checkAvailability = async (req, res) => {
  try {
    const { roomId, date, heure_debut, heure_fin } = req.body;
    
    if (!roomId || !date || !heure_debut || !heure_fin) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check for conflicting exams
    const conflictingExam = await Exam.findOne({
      salle: roomId,
      date: new Date(date),
      $or: [
        {
          heure_debut: { $lt: heure_fin },
          heure_fin: { $gt: heure_debut }
        }
      ],
      status: { $ne: 'cancelled' }
    });
    
    res.json({ 
      available: !conflictingExam,
      conflictingExam: conflictingExam || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available rooms for a specific time slot
exports.getAvailableRooms = async (req, res) => {
  try {
    const { date, heure_debut, heure_fin, minCapacity } = req.body;
    
    if (!date || !heure_debut || !heure_fin) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find all active rooms
    let query = { isActive: true };
    if (minCapacity) {
      query.capacite = { $gte: minCapacity };
    }
    
    const allRooms = await Room.find(query);
    
    // Find rooms that are busy during the requested time
    const busyRooms = await Exam.find({
      date: new Date(date),
      $or: [
        {
          heure_debut: { $lt: heure_fin },
          heure_fin: { $gt: heure_debut }
        }
      ],
      status: { $ne: 'cancelled' }
    }).distinct('salle');
    
    // Filter available rooms
    const availableRooms = allRooms.filter(room => 
      !busyRooms.some(busyRoomId => busyRoomId.toString() === room._id.toString())
    );
    
    res.json({ 
      success: true, 
      availableRooms,
      totalRooms: allRooms.length,
      busyRooms: busyRooms.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get room schedule
exports.getRoomSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    let query = { salle: id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const exams = await Exam.find(query)
      .populate('surveillant', 'name prenom email')
      .sort({ date: 1, heure_debut: 1 });
    
    res.json({ 
      success: true, 
      room,
      schedule: exams 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get rooms statistics
exports.getRoomStatistics = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments({ isActive: true });
    const totalCapacity = await Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$capacite' } } }
    ]);
    
    const roomsByBuilding = await Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$batiment', count: { $sum: 1 }, totalCapacity: { $sum: '$capacite' } } }
    ]);
    
    res.json({
      success: true,
      statistics: {
        totalRooms,
        totalCapacity: totalCapacity[0]?.total || 0,
        roomsByBuilding
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};