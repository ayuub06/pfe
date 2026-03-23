const mongoose = require('mongoose');
const User = require('./models/User');

const listStudents = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');
    
    const students = await User.find({ role: 'etudiant' }).select('email name prenom');
    
    console.log(`📋 Students in database (${students.length} total):\n`);
    students.forEach((s, i) => {
      console.log(`${i+1}. ${s.email} (${s.name} ${s.prenom})`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

listStudents();