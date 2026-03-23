const mongoose = require('mongoose');
const User = require('./models/User');

const listAllUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');
    
    const users = await User.find().select('email name prenom role');
    
    console.log('='.repeat(60));
    console.log('ALL USERS IN DATABASE:');
    console.log('='.repeat(60));
    
    const admins = users.filter(u => u.role === 'admin');
    const professors = users.filter(u => u.role === 'professeur');
    const students = users.filter(u => u.role === 'etudiant');
    
    console.log(`\n👑 ADMINS (${admins.length}):`);
    admins.forEach(a => console.log(`   ${a.email}`));
    
    console.log(`\n👨‍🏫 PROFESSORS (${professors.length}):`);
    professors.forEach(p => console.log(`   ${p.email}`));
    
    console.log(`\n👨‍🎓 STUDENTS (${students.length}):`);
    students.slice(0, 10).forEach(s => console.log(`   ${s.email}`));
    if (students.length > 10) console.log(`   ... and ${students.length - 10} more`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

listAllUsers();