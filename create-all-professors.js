const mongoose = require('mongoose');
const User = require('./models/User');

const createAllProfessors = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Complete professor list with specializations
    const professors = [
      // Computer Science & Programming (5 professors)
      { name: 'Dr. Fauzi', prenom: 'Hassan', email: 'fauzi.hassan@university.com', specialization: 'Computer Science & Programming' },
      { name: 'Dr. Nadia', prenom: 'El Fassi', email: 'nadia.elfassi@university.com', specialization: 'Web Development' },
      { name: 'Dr. Karim', prenom: 'Benjelloun', email: 'karim.benjelloun@university.com', specialization: 'Mobile Development' },
      { name: 'Dr. Samira', prenom: 'Alaoui', email: 'samira.alaoui@university.com', specialization: 'Software Engineering' },
      { name: 'Dr. Reda', prenom: 'Chraibi', email: 'reda.chraibi@university.com', specialization: 'Algorithmics' },
      
      // Mathematics & Statistics (3 professors)
      { name: 'Rachid', prenom: 'Ait Daoud', email: 'rachid.aitdaoud@university.com', specialization: 'Mathematics' },
      { name: 'Dr. Fatima', prenom: 'Zahra', email: 'fatima.zahra@university.com', specialization: 'Statistics' },
      { name: 'Dr. Yassine', prenom: 'Rachidi', email: 'yassine.rachidi@university.com', specialization: 'Probability & Analysis' },
      
      // Databases & Big Data (3 professors)
      { name: 'Dr. Amin', prenom: 'Mohammed', email: 'amin.mohammed@university.com', specialization: 'Databases' },
      { name: 'Dr. Soukaina', prenom: 'Tazi', email: 'soukaina.tazi@university.com', specialization: 'Big Data' },
      { name: 'Dr. Mehdi', prenom: 'Berrada', email: 'mehdi.berrada@university.com', specialization: 'NoSQL & Data Warehousing' },
      
      // Networks & Security (3 professors)
      { name: 'Dr. Regragui', prenom: 'Younes', email: 'regragui.younes@university.com', specialization: 'Networks' },
      { name: 'Dr. Hassan', prenom: 'Amrani', email: 'hassan.amrani@university.com', specialization: 'Cybersecurity' },
      { name: 'Dr. Imane', prenom: 'Berrada', email: 'imane.berrada@university.com', specialization: 'Cloud Computing' },
      
      // Data Science & AI (4 professors)
      { name: 'Dr. Karima', prenom: 'El Fassi', email: 'karima.elfassi@university.com', specialization: 'Data Science' },
      { name: 'Dr. Youssef', prenom: 'Berrada', email: 'youssef.berrada@university.com', specialization: 'Machine Learning' },
      { name: 'Dr. Salma', prenom: 'Tazi', email: 'salma.tazi@university.com', specialization: 'Artificial Intelligence' },
      { name: 'Dr. Omar', prenom: 'Benali', email: 'omar.benali@university.com', specialization: 'Deep Learning' },
      
      // Soft Skills & Management (3 professors)
      { name: 'Dr. Leila', prenom: 'Alaoui', email: 'leila.alaoui@university.com', specialization: 'Project Management' },
      { name: 'Dr. Mohamed', prenom: 'El Mansouri', email: 'mohamed.elm@university.com', specialization: 'Business Communication' },
      { name: 'Dr. Hajar', prenom: 'Zahra', email: 'hajar.zahra@university.com', specialization: 'English & Soft Skills' },
      
      // Web & Frontend (2 professors)
      { name: 'Dr. Anas', prenom: 'Fassi', email: 'anas.fassi@university.com', specialization: 'Frontend Development' },
      { name: 'Dr. Sara', prenom: 'Chraibi', email: 'sara.chraibi@university.com', specialization: 'Backend Development' },
      
      // DevOps & Infrastructure (2 professors)
      { name: 'Dr. Hamza', prenom: 'Amrani', email: 'hamza.amrani@university.com', specialization: 'DevOps' },
      { name: 'Dr. Yasmine', prenom: 'Tazi', email: 'yasmine.tazi@university.com', specialization: 'System Architecture' }
    ];

    // Password for all professors
    const defaultPassword = 'prof123';

    console.log('👨‍🏫 Creating professors...\n');

    let created = 0;
    let existing = 0;

    for (const profData of professors) {
      const exists = await User.findOne({ email: profData.email });
      if (!exists) {
        const professor = new User({
          name: profData.name,
          prenom: profData.prenom,
          email: profData.email,
          password: defaultPassword,
          role: 'professeur',
          specialization: profData.specialization
        });
        await professor.save();
        console.log(`✅ Created: ${profData.name} ${profData.prenom} - ${profData.specialization}`);
        created++;
      } else {
        console.log(`⏭️ Already exists: ${profData.email}`);
        existing++;
      }
    }

    const totalProfessors = await User.countDocuments({ role: 'professeur' });
    const totalStudents = await User.countDocuments({ role: 'etudiant' });
    const totalExams = 160; // Estimated exams
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 PROFESSOR DISTRIBUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`👨‍🏫 Total Professors: ${totalProfessors}`);
    console.log(`👨‍🎓 Total Students: ${totalStudents}`);
    console.log(`📝 Estimated Exams: ${totalExams}`);
    console.log(`\n📅 Exam Period: 15 days`);
    console.log(`👨‍🏫 Supervisors per day: ${totalProfessors}`);
    console.log(`📋 Total supervision capacity: ${totalProfessors} exams/day × 15 days = ${totalProfessors * 15} exams`);
    
    if (totalProfessors * 15 >= totalExams) {
      console.log(`\n✅ SUFFICIENT! Capacity (${totalProfessors * 15}) > Required (${totalExams})`);
      console.log(`   Each professor will supervise ~${Math.ceil(totalExams / totalProfessors)} exams total`);
      console.log(`   ~${Math.ceil(totalExams / totalProfessors / 15)} exam per day average`);
    } else {
      console.log(`\n⚠️ INSUFFICIENT! Need ${Math.ceil(totalExams / 15)} professors`);
    }
    
    console.log('\n✨ Professor creation complete! Now run the module assignment script.');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

createAllProfessors();