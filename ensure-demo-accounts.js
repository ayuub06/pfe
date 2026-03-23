const mongoose = require('mongoose');
const User = require('./models/User');

const ensureDemoAccounts = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Demo accounts to ensure exist
    const demoAccounts = [
      // Admin
      {
        name: 'Admin',
        prenom: 'System',
        email: 'admin@university.com',
        password: 'admin123',
        role: 'admin'
      },
      // Professors
      {
        name: 'Dr. Ahmed',
        prenom: 'Benali',
        email: 'ahmed.benali@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Computer Science'
      },
      {
        name: 'Dr. Fatima',
        prenom: 'Zahra',
        email: 'fatima.zahra@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Mathematics'
      },
      {
        name: 'Dr. Karim',
        prenom: 'El Mansouri',
        email: 'karim.elm@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Physics'
      },
      // Test students that should work
      {
        name: 'Alice',
        prenom: 'Smith',
        email: 'alice.smith@university.com',
        password: 'student123',
        role: 'etudiant',
        numero_etudiant: '2024001',
        departement: 'Computer Science',
        niveau: 'L3'
      },
      {
        name: 'Bob',
        prenom: 'Johnson',
        email: 'bob.johnson@university.com',
        password: 'student123',
        role: 'etudiant',
        numero_etudiant: '2024002',
        departement: 'Mathematics',
        niveau: 'L3'
      },
      {
        name: 'Ayoub',
        prenom: 'Imourigue',
        email: 'hh@gmail.com',
        password: 'student123',
        role: 'etudiant',
        numero_etudiant: '2024003',
        departement: 'Computer Science',
        niveau: 'L3'
      }
    ];

    let created = 0;
    let skipped = 0;

    for (const account of demoAccounts) {
      const exists = await User.findOne({ email: account.email });
      
      if (!exists) {
        const user = new User(account);
        await user.save();
        console.log(`✅ Created: ${account.email} (${account.role})`);
        created++;
      } else {
        console.log(`⏭️  Already exists: ${account.email}`);
        skipped++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} accounts`);
    console.log(`   Already existed: ${skipped} accounts`);
    
    // Show all professors
    const professors = await User.find({ role: 'professeur' }).select('email');
    console.log(`\n👨‍🏫 Available Professors (${professors.length}):`);
    professors.forEach(p => console.log(`   ${p.email} / prof123`));
    
    // Show sample students
    const students = await User.find({ role: 'etudiant' }).limit(5).select('email');
    console.log(`\n👨‍🎓 Sample Students (use password: student123):`);
    students.forEach(s => console.log(`   ${s.email}`));
    
    await mongoose.disconnect();
    console.log('\n✨ Demo accounts ensured!');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

ensureDemoAccounts();