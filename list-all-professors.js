const mongoose = require('mongoose');
const User = require('./models/User');

const listAllProfessors = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    const professors = await User.find({ role: 'professeur' }).select('name prenom email specialization');
    
    console.log('='.repeat(70));
    console.log('👨‍🏫 ALL PROFESSORS IN DATABASE');
    console.log('='.repeat(70));
    console.log(`Total: ${professors.length} professors\n`);
    
    for (let i = 0; i < professors.length; i++) {
      const p = professors[i];
      console.log(`${i+1}. ${p.name} ${p.prenom}`);
      console.log(`   Email: ${p.email}`);
      console.log(`   Specialization: ${p.specialization || 'Not set'}`);
      console.log('');
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

listAllProfessors();