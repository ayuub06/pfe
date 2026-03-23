const mongoose = require('mongoose');
const User = require('./models/User');
const Module = require('./models/Module');
const Exam = require('./models/Exam');

const organizeBySemester = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Define modules by semester for GI and IDS
    const modulesBySemester = {
      GI: {
        S1: ['Algorithmique', 'Programmation C', 'Mathématiques', 'Anglais Technique'],
        S2: ['Programmation Orientée Objet', 'Structures de Données', 'Algèbre', 'Communication'],
        S3: ['Mathématiques Appliquées', 'Base de Données', 'Réseaux', 'Anglais Technique'],
        S4: ['Analyse Numérique', 'Génie Logiciel', 'Systèmes d\'Exploitation', 'Développement Web'],
        S5: ['Algorithmique Avancée', 'Programmation Web', 'Sécurité Informatique', 'Intelligence Artificielle'],
        S6: ['NoSQL', 'Cloud Computing', 'Projet de Fin d\'Année', 'Mobile Development']
      },
      IDS: {
        S1: ['Mathématiques', 'Statistiques', 'Algorithmique', 'Anglais Technique'],
        S2: ['Probabilités', 'SQL', 'Structures de Données', 'Communication'],
        S3: ['Statistiques', 'Base de Données', 'Analyse de Données', 'Anglais Technique'],
        S4: ['SQL Avancé', 'Data Mining', 'Visualisation', 'Business Intelligence'],
        S5: ['Machine Learning', 'Data Mining Avancé', 'Big Data', 'Data Warehousing'],
        S6: ['Deep Learning', 'Data Science', 'Projet de Fin d\'Année', 'Cloud Data']
      }
    };

    // Update student levels based on their student ID
    const students = await User.find({ role: 'etudiant' });
    console.log(`Found ${students.length} students\n`);

    let s1Count = 0, s2Count = 0, s3Count = 0, s4Count = 0, s5Count = 0, s6Count = 0;
    let giS1 = 0, giS2 = 0, giS3 = 0, giS4 = 0, giS5 = 0, giS6 = 0;
    let idsS1 = 0, idsS2 = 0, idsS3 = 0, idsS4 = 0, idsS5 = 0, idsS6 = 0;

    for (const student of students) {
      // Determine semester based on student ID pattern
      let semester = '';
      const idNum = parseInt(student.numero_etudiant?.slice(-3) || '0');
      
      if (student.departement === 'GI') {
        if (idNum <= 10) semester = 'S1';
        else if (idNum <= 20) semester = 'S2';
        else if (idNum <= 30) semester = 'S3';
        else if (idNum <= 40) semester = 'S4';
        else if (idNum <= 50) semester = 'S5';
        else semester = 'S6';
        
        if (semester === 'S1') giS1++;
        else if (semester === 'S2') giS2++;
        else if (semester === 'S3') giS3++;
        else if (semester === 'S4') giS4++;
        else if (semester === 'S5') giS5++;
        else giS6++;
      } else {
        if (idNum <= 7) semester = 'S1';
        else if (idNum <= 14) semester = 'S2';
        else if (idNum <= 21) semester = 'S3';
        else if (idNum <= 28) semester = 'S4';
        else if (idNum <= 35) semester = 'S5';
        else semester = 'S6';
        
        if (semester === 'S1') idsS1++;
        else if (semester === 'S2') idsS2++;
        else if (semester === 'S3') idsS3++;
        else if (semester === 'S4') idsS4++;
        else if (semester === 'S5') idsS5++;
        else idsS6++;
      }
      
      student.semester = semester;
      await student.save();
      
      if (semester === 'S1') s1Count++;
      else if (semester === 'S2') s2Count++;
      else if (semester === 'S3') s3Count++;
      else if (semester === 'S4') s4Count++;
      else if (semester === 'S5') s5Count++;
      else s6Count++;
    }

    console.log('📊 STUDENTS BY SEMESTER:');
    console.log('='.repeat(50));
    console.log(`S1 (Semester 1): ${s1Count} students`);
    console.log(`S2 (Semester 2): ${s2Count} students`);
    console.log(`S3 (Semester 3): ${s3Count} students`);
    console.log(`S4 (Semester 4): ${s4Count} students`);
    console.log(`S5 (Semester 5): ${s5Count} students`);
    console.log(`S6 (Semester 6): ${s6Count} students`);
    
    console.log('\n📊 GI STUDENTS BY SEMESTER:');
    console.log('='.repeat(50));
    console.log(`S1: ${giS1} | S2: ${giS2} | S3: ${giS3} | S4: ${giS4} | S5: ${giS5} | S6: ${giS6}`);
    
    console.log('\n📊 IDS STUDENTS BY SEMESTER:');
    console.log('='.repeat(50));
    console.log(`S1: ${idsS1} | S2: ${idsS2} | S3: ${idsS3} | S4: ${idsS4} | S5: ${idsS5} | S6: ${idsS6}`);

    // Update modules with proper semesters
    console.log('\n📚 UPDATING MODULES BY SEMESTER...');
    
    const allModules = await Module.find({});
    for (const module of allModules) {
      let semester = '';
      if (module.code.includes('S1') || module.code.includes('101')) semester = 'S1';
      else if (module.code.includes('S2') || module.code.includes('102')) semester = 'S2';
      else if (module.code.includes('S3') || module.code.includes('201')) semester = 'S3';
      else if (module.code.includes('S4') || module.code.includes('202')) semester = 'S4';
      else if (module.code.includes('S5') || module.code.includes('301')) semester = 'S5';
      else if (module.code.includes('S6') || module.code.includes('401')) semester = 'S6';
      else if (module.code.includes('COMMON')) {
        if (module.code.includes('101')) semester = 'S1';
        else if (module.code.includes('201')) semester = 'S3';
        else if (module.code.includes('203')) semester = 'S4';
        else semester = 'S3';
      }
      
      if (semester) {
        module.semester = semester;
        await module.save();
        console.log(`   ${module.code} → ${semester}`);
      }
    }

    // Create summary report
    console.log('\n' + '='.repeat(60));
    console.log('📋 SEMESTER SUMMARY REPORT');
    console.log('='.repeat(60));
    
    for (const sem of ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']) {
      const giStudents = await User.countDocuments({ role: 'etudiant', departement: 'GI', semester: sem });
      const idsStudents = await User.countDocuments({ role: 'etudiant', departement: 'IDS', semester: sem });
      const modules = await Module.countDocuments({ semester: sem });
      
      console.log(`\n${sem} (${sem === 'S1' || sem === 'S2' ? 'Licence 1' : sem === 'S3' || sem === 'S4' ? 'Licence 2' : sem === 'S5' ? 'Licence 3' : 'Licence Professionnelle'}):`);
      console.log(`   GI: ${giStudents} students`);
      console.log(`   IDS: ${idsStudents} students`);
      console.log(`   Modules: ${modules}`);
    }

    await mongoose.disconnect();
    console.log('\n✨ Organization complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

organizeBySemester();