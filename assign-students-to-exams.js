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

    // Group students by department and semester
    const studentsByDeptAndSem = {};
    for (const student of students) {
      const key = `${student.departement}_${student.niveau}`;
      if (!studentsByDeptAndSem[key]) {
        studentsByDeptAndSem[key] = [];
      }
      studentsByDeptAndSem[key].push(student);
    }

    console.log('Students by department and semester:');
    for (const [key, value] of Object.entries(studentsByDeptAndSem)) {
      console.log(`   ${key}: ${value.length} students`);
    }

    let assignedCount = 0;
    let updatedCount = 0;

    for (const exam of exams) {
      // Determine which students should take this exam
      let eligibleStudents = [];
      
      if (exam.department === 'COMMON') {
        // Common modules: all students from that semester (both departments)
        eligibleStudents = students.filter(s => s.niveau === exam.semester);
      } else {
        // Department-specific modules: students from that department and semester
        eligibleStudents = students.filter(s => 
          s.departement === exam.department && 
          s.niveau === exam.semester
        );
      }
      
      if (eligibleStudents.length > 0) {
        exam.etudiants = eligibleStudents.map(s => s._id);
        exam.nombre_etudiants = eligibleStudents.length;
        await exam.save();
        updatedCount++;
        console.log(`✅ ${exam.code_module} - ${exam.module}: ${eligibleStudents.length} students (${exam.department} - ${exam.semester})`);
      } else {
        console.log(`⚠️ ${exam.code_module} - ${exam.module}: NO students found for ${exam.department} - ${exam.semester}`);
      }
      assignedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 ASSIGNMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Exams updated: ${updatedCount} / ${assignedCount}`);
    
    // Show some examples
    const sampleExam = await Exam.findOne({ department: 'IDS', semester: 'S4' }).populate('etudiants', 'name prenom email');
    if (sampleExam) {
      console.log(`\n📝 Example: ${sampleExam.module} (${sampleExam.department} - ${sampleExam.semester})`);
      console.log(`   Students: ${sampleExam.etudiants.length}`);
      if (sampleExam.etudiants.length > 0) {
        console.log(`   First student: ${sampleExam.etudiants[0].name} ${sampleExam.etudiants[0].prenom}`);
      }
    }
    
    await mongoose.disconnect();
    console.log('\n✨ Assignment complete! Refresh your browser to see exams for students.');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

assignStudentsToExams();