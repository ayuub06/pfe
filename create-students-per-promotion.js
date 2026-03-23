const mongoose = require('mongoose');
const User = require('./models/User');

const createStudentsPerPromotion = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Delete existing students (optional - be careful!)
    // await User.deleteMany({ role: 'etudiant' });
    // console.log('Cleared existing students\n');

    const promotions = [
      { semester: 'S1', year: '2024-2025', studentsPerDept: 40 },
      { semester: 'S2', year: '2024-2025', studentsPerDept: 40 },
      { semester: 'S3', year: '2023-2024', studentsPerDept: 40 },
      { semester: 'S4', year: '2023-2024', studentsPerDept: 40 },
      { semester: 'S5', year: '2022-2023', studentsPerDept: 40 },
      { semester: 'S6', year: '2022-2023', studentsPerDept: 40 }
    ];

    const firstNames = [
      'Ayoub', 'Sara', 'Omar', 'Fatima', 'Youssef', 'Imane', 'Karim', 'Nadia', 'Mehdi', 'Hajar',
      'Ali', 'Zineb', 'Hamza', 'Salma', 'Rachid', 'Leila', 'Hassan', 'Khadija', 'Mohamed', 'Amina',
      'Adam', 'Malak', 'Yassine', 'Ines', 'Othmane', 'Meriem', 'Anas', 'Soukaina', 'Rayan', 'Lina',
      'Ilyas', 'Manal', 'Zakaria', 'Dounia', 'Sami', 'Nour', 'Fouad', 'Houda', 'Reda', 'Asma'
    ];

    const lastNames = [
      'Benali', 'Alaoui', 'El Mansouri', 'Fassi', 'Berrada', 'Tazi', 'Chraibi', 'Rachidi', 'Amrani', 'Zahra',
      'El Amrani', 'Benjelloun', 'El Fassi', 'El Andaloussi', 'Benchekroun', 'El Malki', 'El Ouali', 'Benhaddou',
      'El Harrak', 'Benomar', 'El Yacoubi', 'Bencheikh', 'El Khatib', 'Bennis', 'El Ghazi', 'Benmoussa'
    ];

    let totalCreated = 0;

    for (const promo of promotions) {
      console.log(`\n📚 Creating students for ${promo.semester} (${promo.year})...`);
      
      // Create GI Students
      for (let i = 1; i <= promo.studentsPerDept; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const studentId = `GI${promo.semester}${String(i).padStart(3, '0')}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.gi.${promo.semester}${i}@university.com`;
        
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
            niveau: promo.semester
          });
          await student.save();
          totalCreated++;
        }
      }
      console.log(`   ✅ Created ${promo.studentsPerDept} GI students for ${promo.semester}`);
      
      // Create IDS Students
      for (let i = 1; i <= promo.studentsPerDept; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const studentId = `IDS${promo.semester}${String(i).padStart(3, '0')}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.ids.${promo.semester}${i}@university.com`;
        
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
            niveau: promo.semester
          });
          await student.save();
          totalCreated++;
        }
      }
      console.log(`   ✅ Created ${promo.studentsPerDept} IDS students for ${promo.semester}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 STUDENT SUMMARY');
    console.log('='.repeat(60));
    
    for (const sem of ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']) {
      const giCount = await User.countDocuments({ role: 'etudiant', departement: 'GI', niveau: sem });
      const idsCount = await User.countDocuments({ role: 'etudiant', departement: 'IDS', niveau: sem });
      console.log(`${sem}: GI: ${giCount} | IDS: ${idsCount} | Total: ${giCount + idsCount}`);
    }
    
    const totalGI = await User.countDocuments({ role: 'etudiant', departement: 'GI' });
    const totalIDS = await User.countDocuments({ role: 'etudiant', departement: 'IDS' });
    const totalStudents = totalGI + totalIDS;
    
    console.log('\n' + '='.repeat(60));
    console.log(`Total GI Students: ${totalGI}`);
    console.log(`Total IDS Students: ${totalIDS}`);
    console.log(`Total Students: ${totalStudents}`);
    console.log(`Total Created: ${totalCreated}`);
    
    await mongoose.disconnect();
    console.log('\n✨ Student creation complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

createStudentsPerPromotion();