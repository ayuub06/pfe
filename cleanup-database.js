const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Module = require('./models/Module');
const Exam = require('./models/Exam');

const cleanupDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Define users to KEEP (good users with proper structure)
    const keepEmails = [
      // Admins
      'admin@university.com',
      'ayoub.imourigue@university.com',
      
      // Professors (all 5)
      'ahmed.benali@university.com',
      'fatima.zahra@university.com',
      'karim.elm@university.com',
      'sanaa.alaoui@university.com',
      'youssef.chraibi@university.com',
      
      // GI Students (keep all with .gi in email)
      // We'll keep all that match pattern *.gi*@university.com
      
      // IDS Students (keep all with .ids in email)
      // We'll keep all that match pattern *.ids*@university.com
    ];

    // Find all users
    const allUsers = await User.find({});
    console.log(`Total users before cleanup: ${allUsers.length}\n`);

    let deletedCount = 0;
    let keptCount = 0;

    for (const user of allUsers) {
      const shouldKeep = 
        keepEmails.includes(user.email) ||
        user.email.includes('.gi') ||
        user.email.includes('.ids') ||
        (user.role === 'professeur' && keepEmails.includes(user.email)) ||
        (user.role === 'admin' && keepEmails.includes(user.email));
      
      if (!shouldKeep && user.email !== 'hh@gmail.com') {
        await User.findByIdAndDelete(user._id);
        console.log(`🗑️ Deleted: ${user.email} (${user.role})`);
        deletedCount++;
      } else {
        console.log(`✅ Kept: ${user.email} (${user.role})`);
        keptCount++;
      }
    }

    console.log(`\n📊 Cleanup Summary:`);
    console.log(`   Deleted: ${deletedCount} users`);
    console.log(`   Kept: ${keptCount} users`);

    // Update university name in all collections (if you want to add this field)
    // This is optional - you can add a university field to your models

    console.log(`\n✨ Database cleanup complete!`);

    // Show remaining users by role
    const remainingAdmins = await User.countDocuments({ role: 'admin' });
    const remainingProfessors = await User.countDocuments({ role: 'professeur' });
    const remainingStudents = await User.countDocuments({ role: 'etudiant' });
    
    console.log(`\n📋 Remaining Users:`);
    console.log(`   👑 Admins: ${remainingAdmins}`);
    console.log(`   👨‍🏫 Professors: ${remainingProfessors}`);
    console.log(`   👨‍🎓 Students: ${remainingStudents}`);

    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

cleanupDatabase();