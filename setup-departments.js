const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Module = require('./models/Module');

const setupSystem = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // 1. Create Professors with their modules
    console.log('👨‍🏫 Creating Professors and Modules...\n');
    
    const professorsData = [
      {
        name: 'Dr. Ahmed',
        prenom: 'Benali',
        email: 'ahmed.benali@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Computer Science',
        modules: [
          { name: 'Algorithmique Avancée', code: 'GI301', department: 'GI', semester: 'S5' },
          { name: 'Programmation Web', code: 'GI302', department: 'GI', semester: 'S5' }
        ]
      },
      {
        name: 'Dr. Fatima',
        prenom: 'Zahra',
        email: 'fatima.zahra@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Mathematics',
        modules: [
          { name: 'Mathématiques Appliquées', code: 'GI201', department: 'GI', semester: 'S3' },
          { name: 'Statistiques', code: 'IDS201', department: 'IDS', semester: 'S3' }
        ]
      },
      {
        name: 'Dr. Karim',
        prenom: 'El Mansouri',
        email: 'karim.elm@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Data Science',
        modules: [
          { name: 'Machine Learning', code: 'IDS401', department: 'IDS', semester: 'S6' },
          { name: 'Big Data', code: 'IDS402', department: 'IDS', semester: 'S6' }
        ]
      }
    ];
    
    for (const profData of professorsData) {
      let professor = await User.findOne({ email: profData.email });
      
      if (!professor) {
        professor = new User({
          name: profData.name,
          prenom: profData.prenom,
          email: profData.email,
          password: profData.password,
          role: profData.role,
          specialization: profData.specialization
        });
        await professor.save();
        console.log(`✅ Created professor: ${profData.name} ${profData.prenom}`);
      } else {
        console.log(`⏭️  Professor exists: ${profData.email}`);
      }
      
      // Create modules for this professor
      for (const moduleData of profData.modules) {
        const moduleExists = await Module.findOne({ code: moduleData.code });
        if (!moduleExists) {
          const module = new Module({
            ...moduleData,
            professor: professor._id
          });
          await module.save();
          console.log(`   📖 Created module: ${moduleData.code} - ${moduleData.name} (${moduleData.department})`);
        }
      }
    }

    // 2. Create Rooms
    console.log('\n🏫 Creating Rooms...\n');
    
    const rooms = [
      { nom: 'GI101', capacite: 50, batiment: 'GI Building', etage: 1, equipment: ['Projector', 'Whiteboard'] },
      { nom: 'GI102', capacite: 45, batiment: 'GI Building', etage: 1, equipment: ['Projector', 'Whiteboard'] },
      { nom: 'IDS101', capacite: 40, batiment: 'IDS Building', etage: 1, equipment: ['Projector', 'Whiteboard'] },
      { nom: 'IDS102', capacite: 35, batiment: 'IDS Building', etage: 1, equipment: ['Projector', 'Computers'] },
      { nom: 'Amphi A', capacite: 200, batiment: 'Main Building', etage: 0, equipment: ['Projector', 'Sound System'] }
    ];
    
    for (const roomData of rooms) {
      const exists = await Room.findOne({ nom: roomData.nom });
      if (!exists) {
        const room = new Room(roomData);
        await room.save();
        console.log(`✅ Created room: ${roomData.nom} (Capacity: ${roomData.capacite})`);
      }
    }

    // 3. Create GI Students (60 students)
    console.log('\n👨‍🎓 Creating GI Students...\n');
    
    const giFirstNames = ['Ayoub', 'Karim', 'Mehdi', 'Youssef', 'Anas', 'Omar', 'Adam', 'Yassine', 'Hamza', 'Reda'];
    const giLastNames = ['Benali', 'Alaoui', 'Fassi', 'Tazi', 'Berrada', 'Chraibi', 'Amrani'];
    
    for (let i = 1; i <= 60; i++) {
      const firstName = giFirstNames[Math.floor(Math.random() * giFirstNames.length)];
      const lastName = giLastNames[Math.floor(Math.random() * giLastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.gi${i}@university.com`;
      const studentId = `GI2024${String(i).padStart(3, '0')}`;
      
      const exists = await User.findOne({ email });
      if (!exists) {
        const student = new User({
          name: firstName,
          prenom: lastName,
          email: email,
          password: 'student123',
          role: 'etudiant',
          numero_etudiant: studentId,
          departement: 'GI',
          niveau: ['L3', 'M1'][Math.floor(Math.random() * 2)]
        });
        await student.save();
        if (i <= 10) console.log(`   ✅ ${email}`);
      }
    }
    console.log(`   ✅ Created 60 GI students`);

    // 4. Create IDS Students (40 students)
    console.log('\n👨‍🎓 Creating IDS Students...\n');
    
    const idsFirstNames = ['Sara', 'Fatima', 'Imane', 'Nadia', 'Leila', 'Hajar', 'Salma', 'Meriem'];
    const idsLastNames = ['Zahra', 'El Mansouri', 'Benjelloun', 'El Fassi', 'Berrada', 'Tazi'];
    
    for (let i = 1; i <= 40; i++) {
      const firstName = idsFirstNames[Math.floor(Math.random() * idsFirstNames.length)];
      const lastName = idsLastNames[Math.floor(Math.random() * idsLastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.ids${i}@university.com`;
      const studentId = `IDS2024${String(i).padStart(3, '0')}`;
      
      const exists = await User.findOne({ email });
      if (!exists) {
        const student = new User({
          name: firstName,
          prenom: lastName,
          email: email,
          password: 'student123',
          role: 'etudiant',
          numero_etudiant: studentId,
          departement: 'IDS',
          niveau: ['L3', 'M1'][Math.floor(Math.random() * 2)]
        });
        await student.save();
        if (i <= 10) console.log(`   ✅ ${email}`);
      }
    }
    console.log(`   ✅ Created 40 IDS students`);

    // 5. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SETUP COMPLETE!');
    console.log('='.repeat(60));
    console.log(`👑 Admins: ${await User.countDocuments({ role: 'admin' })}`);
    console.log(`👨‍🏫 Professors: ${await User.countDocuments({ role: 'professeur' })}`);
    console.log(`👨‍🎓 GI Students: ${await User.countDocuments({ role: 'etudiant', departement: 'GI' })}`);
    console.log(`👨‍🎓 IDS Students: ${await User.countDocuments({ role: 'etudiant', departement: 'IDS' })}`);
    console.log(`🏫 Rooms: ${await Room.countDocuments()}`);
    console.log(`📚 Modules: ${await Module.countDocuments()}`);
    
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('='.repeat(60));
    console.log('\n👑 ADMIN:');
    console.log('   admin@university.com / admin123');
    
    console.log('\n👨‍🏫 PROFESSORS:');
    console.log('   ahmed.benali@university.com / prof123');
    console.log('   fatima.zahra@university.com / prof123');
    console.log('   karim.elm@university.com / prof123');
    
    console.log('\n👨‍🎓 GI STUDENTS (sample):');
    console.log('   ayoub.benali.gi1@university.com / student123');
    console.log('   karim.alaoui.gi2@university.com / student123');
    console.log('   mehdi.fassi.gi3@university.com / student123');
    
    console.log('\n👨‍🎓 IDS STUDENTS (sample):');
    console.log('   sara.zahra.ids1@university.com / student123');
    console.log('   fatima.elmansouri.ids2@university.com / student123');
    console.log('   imane.benjelloun.ids3@university.com / student123');
    
    console.log('\n✨ Setup complete! You can now login.');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

setupSystem();