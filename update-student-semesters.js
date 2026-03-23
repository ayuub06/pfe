const mongoose = require('mongoose');
const User = require('./models/User');

const updateStudentSemesters = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    const students = await User.find({ role: 'etudiant' });
    console.log(`Found ${students.length} students\n`);

    let updated = 0;

    for (const student of students) {
      // Determine semester based on student ID
      let semester = '';
      
      if (student.numero_etudiant) {
        const idNum = parseInt(student.numero_etudiant.slice(-3));
        
        if (student.departement === 'GI') {
          if (idNum <= 10) semester = 'S1';
          else if (idNum <= 20) semester = 'S2';
          else if (idNum <= 30) semester = 'S3';
          else if (idNum <= 40) semester = 'S4';
          else if (idNum <= 50) semester = 'S5';
          else semester = 'S6';
        } else if (student.departement === 'IDS') {
          if (idNum <= 7) semester = 'S1';
          else if (idNum <= 14) semester = 'S2';
          else if (idNum <= 21) semester = 'S3';
          else if (idNum <= 28) semester = 'S4';
          else if (idNum <= 35) semester = 'S5';
          else semester = 'S6';
        }
      }
      
      // If no student ID, check email pattern
      if (!semester && student.email) {
        if (student.email.includes('.gi')) {
          const match = student.email.match(/gi(\d+)/);
          if (match) {
            const num = parseInt(match[1]);
            if (num <= 10) semester = 'S1';
            else if (num <= 20) semester = 'S2';
            else if (num <= 30) semester = 'S3';
            else if (num <= 40) semester = 'S4';
            else if (num <= 50) semester = 'S5';
            else semester = 'S6';
          }
        } else if (student.email.includes('.ids')) {
          const match = student.email.match(/ids(\d+)/);
          if (match) {
            const num = parseInt(match[1]);
            if (num <= 7) semester = 'S1';
            else if (num <= 14) semester = 'S2';
            else if (num <= 21) semester = 'S3';
            else if (num <= 28) semester = 'S4';
            else if (num <= 35) semester = 'S5';
            else semester = 'S6';
          }
        }
      }
      
      if (semester) {
        student.niveau = semester;
        await student.save();
        updated++;
      }
    }

    console.log(`✅ Updated ${updated} students with semester information`);
    
    // Display summary
    console.log('\n📊 Student Summary by Department and Semester:');
    console.log('='.repeat(50));
    
    const giS1 = await User.countDocuments({ role: 'etudiant', departement: 'GI', niveau: 'S1' });
    const giS2 = await User.countDocuments({ role: 'etudiant', departement: 'GI', niveau: 'S2' });
    const giS3 = await User.countDocuments({ role: 'etudiant', departement: 'GI', niveau: 'S3' });
    const giS4 = await User.countDocuments({ role: 'etudiant', departement: 'GI', niveau: 'S4' });
    const giS5 = await User.countDocuments({ role: 'etudiant', departement: 'GI', niveau: 'S5' });
    const giS6 = await User.countDocuments({ role: 'etudiant', departement: 'GI', niveau: 'S6' });
    
    const idsS1 = await User.countDocuments({ role: 'etudiant', departement: 'IDS', niveau: 'S1' });
    const idsS2 = await User.countDocuments({ role: 'etudiant', departement: 'IDS', niveau: 'S2' });
    const idsS3 = await User.countDocuments({ role: 'etudiant', departement: 'IDS', niveau: 'S3' });
    const idsS4 = await User.countDocuments({ role: 'etudiant', departement: 'IDS', niveau: 'S4' });
    const idsS5 = await User.countDocuments({ role: 'etudiant', departement: 'IDS', niveau: 'S5' });
    const idsS6 = await User.countDocuments({ role: 'etudiant', departement: 'IDS', niveau: 'S6' });
    
    console.log('\nGI Students:');
    console.log(`  S1: ${giS1} | S2: ${giS2} | S3: ${giS3} | S4: ${giS4} | S5: ${giS5} | S6: ${giS6}`);
    
    console.log('\nIDS Students:');
    console.log(`  S1: ${idsS1} | S2: ${idsS2} | S3: ${idsS3} | S4: ${idsS4} | S5: ${idsS5} | S6: ${idsS6}`);
    
    const totalGI = giS1 + giS2 + giS3 + giS4 + giS5 + giS6;
    const totalIDS = idsS1 + idsS2 + idsS3 + idsS4 + idsS5 + idsS6;
    
    console.log('\n' + '='.repeat(50));
    console.log(`Total GI Students: ${totalGI}`);
    console.log(`Total IDS Students: ${totalIDS}`);
    console.log(`Total Students: ${totalGI + totalIDS}`);
    
    await mongoose.disconnect();
    console.log('\n✨ Update complete! Refresh your browser to see the changes.');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

updateStudentSemesters();