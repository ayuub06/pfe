const mongoose = require('mongoose');
const User = require('./models/User');

const createTestStudents = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Create 10 simple test students with easy-to-remember emails
    const testStudents = [
      { name: 'Alice', prenom: 'Smith', email: 'alice.smith@university.com', studentId: '2024001', dept: 'Computer Science' },
      { name: 'Bob', prenom: 'Johnson', email: 'bob.johnson@university.com', studentId: '2024002', dept: 'Mathematics' },
      { name: 'Charlie', prenom: 'Williams', email: 'charlie.williams@university.com', studentId: '2024003', dept: 'Physics' },
      { name: 'Diana', prenom: 'Brown', email: 'diana.brown@university.com', studentId: '2024004', dept: 'Chemistry' },
      { name: 'Eve', prenom: 'Davis', email: 'eve.davis@university.com', studentId: '2024005', dept: 'Biology' },
      { name: 'Frank', prenom: 'Miller', email: 'frank.miller@university.com', studentId: '2024006', dept: 'Economics' },
      { name: 'Grace', prenom: 'Wilson', email: 'grace.wilson@university.com', studentId: '2024007', dept: 'Psychology' },
      { name: 'Henry', prenom: 'Moore', email: 'henry.moore@university.com', studentId: '2024008', dept: 'History' },
      { name: 'Ivy', prenom: 'Taylor', email: 'ivy.taylor@university.com', studentId: '2024009', dept: 'Philosophy' },
      { name: 'Jack', prenom: 'Anderson', email: 'jack.anderson@university.com', studentId: '2024010', dept: 'Engineering' }
    ];

    let created = 0;
    let skipped = 0;

    for (const student of testStudents) {
      const exists = await User.findOne({ email: student.email });
      
      if (!exists) {
        const newStudent = new User({
          name: student.name,
          prenom: student.prenom,
          email: student.email,
          password: 'student123',
          role: 'etudiant',
          numero_etudiant: student.studentId,
          departement: student.dept,
          niveau: 'L3'
        });
        
        await newStudent.save();
        console.log(`✅ Created: ${student.email}`);
        created++;
      } else {
        console.log(`⏭️  Already exists: ${student.email}`);
        skipped++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} students`);
    console.log(`   Skipped: ${skipped} students`);
    
    // Show all students in database
    const allStudents = await User.find({ role: 'etudiant' }).select('email name prenom');
    console.log(`\n📋 All students in database (${allStudents.length} total):`);
    allStudents.forEach((s, i) => {
      console.log(`   ${i+1}. ${s.email}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✨ Done! Try logging in with any of these emails and password: student123');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

createTestStudents();