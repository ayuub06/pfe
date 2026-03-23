const mongoose = require('mongoose');
const User = require('./models/User');

const seedAllUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Clear existing non-admin users (optional - be careful!)
    // Comment this out if you want to keep existing users
    // await User.deleteMany({ role: { $ne: 'admin' } });
    // console.log('Cleared existing non-admin users\n');

    // Create Professors
    const professors = [
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
      {
        name: 'Dr. Sanaa',
        prenom: 'Alaoui',
        email: 'sanaa.alaoui@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'English Literature'
      },
      {
        name: 'Dr. Youssef',
        prenom: 'Chraibi',
        email: 'youssef.chraibi@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Economics'
      }
    ];

    // Create 100 Students
    const departments = [
      'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'Economics', 'Business Administration', 'Engineering', 'Medicine', 'Law',
      'Psychology', 'Sociology', 'History', 'Philosophy', 'Fine Arts',
      'Architecture', 'Education', 'Environmental Science', 'Data Science'
    ];
    
    const firstNames = [
      'Ayoub', 'Sara', 'Omar', 'Fatima', 'Youssef', 'Imane', 'Karim', 'Nadia', 'Mehdi', 'Hajar',
      'Ali', 'Zineb', 'Hamza', 'Salma', 'Rachid', 'Leila', 'Hassan', 'Khadija', 'Mohamed', 'Amina',
      'Adam', 'Malak', 'Yassine', 'Ines', 'Othmane', 'Meriem', 'Anas', 'Soukaina', 'Rayan', 'Lina',
      'Ilyas', 'Manal', 'Zakaria', 'Dounia', 'Sami', 'Nour', 'Fouad', 'Houda', 'Reda', 'Asma',
      'Taha', 'Wiam', 'Amine', 'Rania', 'Salah', 'Nisrine', 'Idriss', 'Ghita', 'Achraf', 'Chaimae'
    ];
    
    const lastNames = [
      'Benali', 'Alaoui', 'El Mansouri', 'Fassi', 'Berrada', 'Tazi', 'Chraibi', 'Rachidi', 'Amrani', 'Zahra',
      'El Amrani', 'Benjelloun', 'El Fassi', 'El Andaloussi', 'Benchekroun', 'El Malki', 'El Ouali', 'Benhaddou',
      'El Harrak', 'Benomar', 'El Yacoubi', 'Bencheikh', 'El Khatib', 'Bennis', 'El Ghazi', 'Benmoussa'
    ];
    
    const niveaus = ['L1', 'L2', 'L3', 'M1', 'M2'];

    // Check existing users
    const existingProfessors = await User.countDocuments({ role: 'professeur' });
    const existingStudents = await User.countDocuments({ role: 'etudiant' });
    
    console.log(`📊 Existing users:`);
    console.log(`   Professors: ${existingProfessors}`);
    console.log(`   Students: ${existingStudents}\n`);

    // Create professors if needed
    let createdProfessors = [];
    if (existingProfessors < professors.length) {
      console.log(`👨‍🏫 Creating ${professors.length - existingProfessors} professors...`);
      for (const prof of professors) {
        const exists = await User.findOne({ email: prof.email });
        if (!exists) {
          const newProf = new User(prof);
          await newProf.save();
          createdProfessors.push(newProf);
          console.log(`   ✅ Created: ${prof.name} ${prof.prenom} (${prof.email})`);
        } else {
          console.log(`   ⏭️  Already exists: ${prof.email}`);
          createdProfessors.push(exists);
        }
      }
    } else {
      console.log(`✅ Already have ${existingProfessors} professors`);
      createdProfessors = await User.find({ role: 'professeur' });
    }

    // Create 100 students
    const studentsToCreate = 100 - existingStudents;
    if (studentsToCreate > 0) {
      console.log(`\n👨‍🎓 Creating ${studentsToCreate} students...`);
      
      const students = [];
      for (let i = 1; i <= studentsToCreate; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const niveau = niveaus[Math.floor(Math.random() * niveaus.length)];
        const studentId = `2024${String(existingStudents + i).padStart(3, '0')}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${existingStudents + i}@university.com`;
        
        const student = new User({
          name: firstName,
          prenom: lastName,
          email: email,
          password: 'student123',
          role: 'etudiant',
          numero_etudiant: studentId,
          departement: department,
          niveau: niveau,
        });
        
        students.push(student);
        
        if (i % 20 === 0) {
          console.log(`   Created ${i} students...`);
        }
      }
      
      await User.insertMany(students);
      console.log(`\n✅ Successfully created ${students.length} new students!`);
    } else {
      console.log(`\n✅ Already have ${existingStudents} students`);
    }

    // Show summary
    const totalProfessors = await User.countDocuments({ role: 'professeur' });
    const totalStudents = await User.countDocuments({ role: 'etudiant' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL SUMMARY');
    console.log('='.repeat(50));
    console.log(`👑 Admins: ${totalAdmins}`);
    console.log(`👨‍🏫 Professors: ${totalProfessors}`);
    console.log(`👨‍🎓 Students: ${totalStudents}`);
    console.log(`📚 Total Users: ${totalAdmins + totalProfessors + totalStudents}`);
    
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    console.log('\n👑 ADMIN:');
    console.log('   Email: admin@university.com');
    console.log('   Password: admin123');
    
    console.log('\n👨‍🏫 PROFESSORS:');
    createdProfessors.slice(0, 3).forEach(prof => {
      console.log(`   ${prof.email} / prof123`);
    });
    console.log('   ... and more');
    
    console.log('\n👨‍🎓 STUDENTS (sample):');
    const sampleStudents = await User.find({ role: 'etudiant' }).limit(5);
    sampleStudents.forEach(student => {
      console.log(`   ${student.email} / student123`);
    });
    console.log(`   ... and ${totalStudents - 5} more students`);
    
    console.log('\n✨ Database seeding complete!');
    console.log('You can now login with any of these accounts.');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
  }
};

seedAllUsers();