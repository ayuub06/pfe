const mongoose = require('mongoose');
const User = require('./models/User');

const generateStudents = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB');
    
    const departments = [
      'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'Economics', 'Business', 'Engineering', 'Medicine', 'Law',
      'Psychology', 'Sociology', 'History', 'Philosophy', 'Arts'
    ];
    
    const firstNames = [
      'Ayoub', 'Sara', 'Omar', 'Fatima', 'Youssef', 'Imane', 'Karim', 'Nadia', 'Mehdi', 'Hajar',
      'Ali', 'Zineb', 'Hamza', 'Salma', 'Rachid', 'Leila', 'Hassan', 'Khadija', 'Mohamed', 'Amina',
      'Adam', 'Malak', 'Yassine', 'Ines', 'Othmane', 'Meriem', 'Anas', 'Soukaina', 'Rayan', 'Lina'
    ];
    
    const lastNames = [
      'Benali', 'Alaoui', 'El Mansouri', 'Fassi', 'Berrada', 'Tazi', 'Chraibi', 'Rachidi', 'Amrani', 'Zahra',
      'El Amrani', 'Benjelloun', 'El Fassi', 'El Andaloussi', 'Benchekroun', 'El Malki', 'El Ouali', 'Benhaddou'
    ];
    
    const niveaus = ['L1', 'L2', 'L3', 'M1', 'M2'];
    
    // Check existing students
    const existingCount = await User.countDocuments({ role: 'etudiant' });
    console.log(`Existing students: ${existingCount}`);
    
    if (existingCount >= 100) {
      console.log(`✅ Already have ${existingCount} students. No need to generate.`);
      await mongoose.disconnect();
      return;
    }
    
    const studentsToCreate = 100 - existingCount;
    console.log(`Creating ${studentsToCreate} new students...`);
    
    const students = [];
    for (let i = 1; i <= studentsToCreate; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const niveau = niveaus[Math.floor(Math.random() * niveaus.length)];
      const studentId = `2024${String(existingCount + i).padStart(3, '0')}`;
      
      const student = new User({
        name: firstName,
        prenom: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${existingCount + i}@university.com`,
        password: 'student123',
        role: 'etudiant',
        numero_etudiant: studentId,
        departement: department,
        niveau: niveau,
      });
      
      students.push(student);
    }
    
    await User.insertMany(students);
    console.log(`\n✅ Successfully created ${students.length} new students!`);
    console.log(`\n📊 Total Students: ${existingCount + students.length}`);
    console.log(`   Default Password: student123`);
    
    await mongoose.disconnect();
    console.log(`\n✨ Done!`);
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

generateStudents();