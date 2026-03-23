const mongoose = require('mongoose');
const User = require('./models/User');
const Module = require('./models/Module');

const setupCompleteModules = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Clear existing modules (optional - be careful!)
    // await Module.deleteMany({});
    // console.log('Cleared existing modules\n');

    // Complete modules by semester for GI
    const giModules = {
      S1: [
        { name: 'Algorithmique et Programmation', code: 'GI101', credits: 4, hours: 45 },
        { name: 'Mathématiques 1 (Algèbre)', code: 'GI102', credits: 4, hours: 45 },
        { name: 'Architecture des Ordinateurs', code: 'GI103', credits: 3, hours: 30 },
        { name: 'Systèmes d\'Exploitation 1', code: 'GI104', credits: 3, hours: 30 },
        { name: 'Réseaux 1', code: 'GI105', credits: 3, hours: 30 },
        { name: 'Introduction à la Programmation Web', code: 'GI106', credits: 3, hours: 30 },
        { name: 'Anglais Technique 1', code: 'COM101', credits: 2, hours: 20 } // Soft skills
      ],
      S2: [
        { name: 'Programmation Orientée Objet (Java)', code: 'GI201', credits: 4, hours: 45 },
        { name: 'Mathématiques 2 (Analyse)', code: 'GI202', credits: 4, hours: 45 },
        { name: 'Structures de Données', code: 'GI203', credits: 4, hours: 45 },
        { name: 'Base de Données 1', code: 'GI204', credits: 3, hours: 30 },
        { name: 'Systèmes d\'Exploitation 2', code: 'GI205', credits: 3, hours: 30 },
        { name: 'Développement Web 1 (HTML/CSS/JS)', code: 'GI206', credits: 3, hours: 30 },
        { name: 'Communication et Expression', code: 'COM102', credits: 2, hours: 20 } // Soft skills
      ],
      S3: [
        { name: 'Programmation Avancée (C#)', code: 'GI301', credits: 4, hours: 45 },
        { name: 'Algorithmique Avancée', code: 'GI302', credits: 4, hours: 45 },
        { name: 'Base de Données 2 (SQL Avancé)', code: 'GI303', credits: 4, hours: 45 },
        { name: 'Réseaux 2 (TCP/IP)', code: 'GI304', credits: 3, hours: 30 },
        { name: 'Génie Logiciel', code: 'GI305', credits: 3, hours: 30 },
        { name: 'Développement Web 2 (PHP)', code: 'GI306', credits: 3, hours: 30 },
        { name: 'Anglais Technique 2', code: 'COM103', credits: 2, hours: 20 } // Soft skills
      ],
      S4: [
        { name: 'Programmation Mobile (Android)', code: 'GI401', credits: 4, hours: 45 },
        { name: 'Intelligence Artificielle', code: 'GI402', credits: 4, hours: 45 },
        { name: 'Sécurité Informatique', code: 'GI403', credits: 4, hours: 45 },
        { name: 'Cloud Computing', code: 'GI404', credits: 3, hours: 30 },
        { name: 'NoSQL Databases', code: 'GI405', credits: 3, hours: 30 },
        { name: 'Développement Web 3 (React)', code: 'GI406', credits: 3, hours: 30 },
        { name: 'Gestion de Projet', code: 'COM104', credits: 2, hours: 20 } // Soft skills
      ],
      S5: [
        { name: 'Big Data Analytics', code: 'GI501', credits: 4, hours: 45 },
        { name: 'Machine Learning', code: 'GI502', credits: 4, hours: 45 },
        { name: 'DevOps', code: 'GI503', credits: 4, hours: 45 },
        { name: 'Microservices Architecture', code: 'GI504', credits: 3, hours: 30 },
        { name: 'Blockchain', code: 'GI505', credits: 3, hours: 30 },
        { name: 'Projet de Fin d\'Année 1', code: 'GI506', credits: 3, hours: 30 },
        { name: 'Entrepreneuriat', code: 'COM105', credits: 2, hours: 20 } // Soft skills
      ],
      S6: [
        { name: 'Deep Learning', code: 'GI601', credits: 4, hours: 45 },
        { name: 'IoT et Systèmes Embarqués', code: 'GI602', credits: 4, hours: 45 },
        { name: 'Cybersécurité Avancée', code: 'GI603', credits: 4, hours: 45 },
        { name: 'Data Science', code: 'GI604', credits: 3, hours: 30 },
        { name: 'Cloud Native', code: 'GI605', credits: 3, hours: 30 },
        { name: 'Projet de Fin d\'Année 2', code: 'GI606', credits: 3, hours: 30 },
        { name: 'Leadership et Management', code: 'COM106', credits: 2, hours: 20 } // Soft skills
      ]
    };

    // Complete modules by semester for IDS
    const idsModules = {
      S1: [
        { name: 'Algorithmique et Programmation', code: 'IDS101', credits: 4, hours: 45 },
        { name: 'Mathématiques 1', code: 'IDS102', credits: 4, hours: 45 },
        { name: 'Statistiques Descriptives', code: 'IDS103', credits: 3, hours: 30 },
        { name: 'Introduction aux Bases de Données', code: 'IDS104', credits: 3, hours: 30 },
        { name: 'Excel Avancé', code: 'IDS105', credits: 3, hours: 30 },
        { name: 'Introduction au Data Mining', code: 'IDS106', credits: 3, hours: 30 },
        { name: 'Anglais Technique 1', code: 'COM101', credits: 2, hours: 20 } // Shared
      ],
      S2: [
        { name: 'Programmation Python', code: 'IDS201', credits: 4, hours: 45 },
        { name: 'Mathématiques 2 (Analyse)', code: 'IDS202', credits: 4, hours: 45 },
        { name: 'Probabilités', code: 'IDS203', credits: 4, hours: 45 },
        { name: 'SQL Avancé', code: 'IDS204', credits: 3, hours: 30 },
        { name: 'Visualisation de Données', code: 'IDS205', credits: 3, hours: 30 },
        { name: 'Introduction à la Business Intelligence', code: 'IDS206', credits: 3, hours: 30 },
        { name: 'Communication et Expression', code: 'COM102', credits: 2, hours: 20 } // Shared
      ],
      S3: [
        { name: 'Data Mining', code: 'IDS301', credits: 4, hours: 45 },
        { name: 'Machine Learning 1', code: 'IDS302', credits: 4, hours: 45 },
        { name: 'Big Data Fundamentals', code: 'IDS303', credits: 4, hours: 45 },
        { name: 'Data Warehousing', code: 'IDS304', credits: 3, hours: 30 },
        { name: 'R pour Data Science', code: 'IDS305', credits: 3, hours: 30 },
        { name: 'Business Intelligence Tools', code: 'IDS306', credits: 3, hours: 30 },
        { name: 'Anglais Technique 2', code: 'COM103', credits: 2, hours: 20 } // Shared
      ],
      S4: [
        { name: 'Machine Learning 2', code: 'IDS401', credits: 4, hours: 45 },
        { name: 'Deep Learning', code: 'IDS402', credits: 4, hours: 45 },
        { name: 'Big Data Technologies', code: 'IDS403', credits: 4, hours: 45 },
        { name: 'NoSQL Databases', code: 'IDS404', credits: 3, hours: 30 },
        { name: 'Data Engineering', code: 'IDS405', credits: 3, hours: 30 },
        { name: 'Tableau/Power BI Avancé', code: 'IDS406', credits: 3, hours: 30 },
        { name: 'Gestion de Projet', code: 'COM104', credits: 2, hours: 20 } // Shared
      ],
      S5: [
        { name: 'Big Data Analytics', code: 'IDS501', credits: 4, hours: 45 },
        { name: 'Data Science', code: 'IDS502', credits: 4, hours: 45 },
        { name: 'Cloud Data Platforms', code: 'IDS503', credits: 4, hours: 45 },
        { name: 'Data Governance', code: 'IDS504', credits: 3, hours: 30 },
        { name: 'Projet Data 1', code: 'IDS505', credits: 3, hours: 30 },
        { name: 'Python pour Data Science', code: 'IDS506', credits: 3, hours: 30 },
        { name: 'Entrepreneuriat', code: 'COM105', credits: 2, hours: 20 } // Shared
      ],
      S6: [
        { name: 'AI for Business', code: 'IDS601', credits: 4, hours: 45 },
        { name: 'Advanced Data Science', code: 'IDS602', credits: 4, hours: 45 },
        { name: 'MLOps', code: 'IDS603', credits: 4, hours: 45 },
        { name: 'Projet Data 2', code: 'IDS604', credits: 3, hours: 30 },
        { name: 'Data Ethics', code: 'IDS605', credits: 3, hours: 30 },
        { name: 'Time Series Analysis', code: 'IDS606', credits: 3, hours: 30 },
        { name: 'Leadership et Management', code: 'COM106', credits: 2, hours: 20 } // Shared
      ]
    };

    // Get professors
    const professors = await User.find({ role: 'professeur' });
    
    // Create GI modules
    console.log('📚 Creating GI Modules...\n');
    for (const [semester, modules] of Object.entries(giModules)) {
      console.log(`\n${semester} - GI Modules:`);
      for (const moduleData of modules) {
        const exists = await Module.findOne({ code: moduleData.code });
        if (!exists) {
          // Assign professor based on module type
          let professor = null;
          if (moduleData.code.startsWith('COM')) {
            professor = professors.find(p => p.specialization === 'Languages' || p.specialization === 'Management');
          } else {
            professor = professors.find(p => p.specialization === 'Computer Science' || p.specialization === 'Programming');
          }
          
          const module = new Module({
            ...moduleData,
            department: moduleData.code.startsWith('COM') ? 'COMMON' : 'GI',
            semester: semester,
            professor: professor?._id || professors[0]?._id
          });
          await module.save();
          console.log(`  ✅ Created: ${moduleData.code} - ${moduleData.name}`);
        } else {
          console.log(`  ⏭️ Already exists: ${moduleData.code}`);
        }
      }
    }

    // Create IDS modules
    console.log('\n📚 Creating IDS Modules...\n');
    for (const [semester, modules] of Object.entries(idsModules)) {
      console.log(`\n${semester} - IDS Modules:`);
      for (const moduleData of modules) {
        const exists = await Module.findOne({ code: moduleData.code });
        if (!exists) {
          let professor = null;
          if (moduleData.code.startsWith('COM')) {
            professor = professors.find(p => p.specialization === 'Languages' || p.specialization === 'Management');
          } else {
            professor = professors.find(p => p.specialization === 'Data Science' || p.specialization === 'Statistics');
          }
          
          const module = new Module({
            ...moduleData,
            department: moduleData.code.startsWith('COM') ? 'COMMON' : 'IDS',
            semester: semester,
            professor: professor?._id || professors[0]?._id
          });
          await module.save();
          console.log(`  ✅ Created: ${moduleData.code} - ${moduleData.name}`);
        } else {
          console.log(`  ⏭️ Already exists: ${moduleData.code}`);
        }
      }
    }

    console.log('\n✅ Module setup complete!');
    
    // Summary
    const totalModules = await Module.countDocuments();
    const giModulesCount = await Module.countDocuments({ department: 'GI' });
    const idsModulesCount = await Module.countDocuments({ department: 'IDS' });
    const commonModulesCount = await Module.countDocuments({ department: 'COMMON' });
    
    console.log('\n📊 Module Summary:');
    console.log(`   Total Modules: ${totalModules}`);
    console.log(`   GI Modules: ${giModulesCount}`);
    console.log(`   IDS Modules: ${idsModulesCount}`);
    console.log(`   Common Modules: ${commonModulesCount}`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

setupCompleteModules();