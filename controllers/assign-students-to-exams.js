const mongoose = require('mongoose');
const Exam = require('./models/Exam');
const User = require('./models/User');

const assignStudentsToExams = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Get all exams
    const exams = await Exam.find({});
    console.log(`Found ${exams.length} exams\n`);

    // Get all students
    const students = await User.find({ role: 'etudiant' });
    console.log(`Found ${students.length} students\n`);

    let assignedCount = 0;

    for (const exam of exams) {
      // Find students that should take this exam based on department and semester
      let eligibleStudents = [];
      
      if (exam.department === 'COMMON') {
        // Common modules: all students from both departments
        eligibleStudents = students.filter(s => 
          s.niveau === exam.semester
        );
      } else {
        // Department-specific modules: students from that department only
        eligibleStudents = students.filter(s => 
          s.departement === exam.department && 
          s.niveau === exam.semester
        );
      }
      
      if (eligibleStudents.length > 0) {
        exam.etudiants = eligibleStudents.map(s => s._id);
        exam.nombre_etudiants = eligibleStudents.length;
        await exam.save();
        assignedCount++;
        console.log(`✅ ${exam.code_module} - ${exam.module}: assigned ${eligibleStudents.length} students (${exam.department} - ${exam.semester})`);
      } else {
        console.log(`⚠️ ${exam.code_module} - ${exam.module}: no students found for ${exam.department} - ${exam.semester}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 ASSIGNMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Exams updated: ${assignedCount}`);
    
    // Show some examples
    const sampleExam = await Exam.findOne().populate('etudiants', 'name prenom email');
    if (sampleExam) {
      console.log(`\n📝 Example: ${sampleExam.module}`);
      console.log(`   Students: ${sampleExam.etudiants.length}`);
      console.log(`   First student: ${sampleExam.etudiants[0]?.name} ${sampleExam.etudiants[0]?.prenom}`);
    }
    
    await mongoose.disconnect();
    console.log('\n✨ Assignment complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

assignStudentsToExams();