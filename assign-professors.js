const mongoose = require('mongoose');
const User = require('./models/User');
const Module = require('./models/Module');

const assignProfessorsBySpecialization = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Define professors with their specializations
    const professors = [
      {
        name: 'Dr. Fauzi',
        prenom: 'Hassan',
        email: 'fauzi.hassan@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Computer Science & Programming'
      },
      {
        name: 'Rachid',
        prenom: 'Ait Daoud',
        email: 'rachid.aitdaoud@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Mathematics & Statistics'
      },
      {
        name: 'Dr. Hammime',
        prenom: 'Ali',
        email: 'hammime.ali@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Software Engineering & Web Development'
      },
      {
        name: 'Dr. Amin',
        prenom: 'Mohammed',
        email: 'amin.mohammed@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Databases & Big Data'
      },
      {
        name: 'Dr. Regragui',
        prenom: 'Younes',
        email: 'regragui.younes@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Networks & Security'
      },
      {
        name: 'Dr. Karima',
        prenom: 'El Fassi',
        email: 'karima.elfassi@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Data Science & AI'
      },
      {
        name: 'Dr. Youssef',
        prenom: 'Berrada',
        email: 'youssef.berrada@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Soft Skills & Management'
      }
    ];

    // Update or create professors
    console.log('👨‍🏫 Updating professors...\n');
    const createdProfessors = [];
    
    for (const profData of professors) {
      let professor = await User.findOne({ email: profData.email });
      if (!professor) {
        professor = new User(profData);
        await professor.save();
        console.log(`✅ Created: ${profData.name} ${profData.prenom} - ${profData.specialization}`);
      } else {
        professor.specialization = profData.specialization;
        await professor.save();
        console.log(`✅ Updated: ${profData.name} ${profData.prenom} - ${profData.specialization}`);
      }
      createdProfessors.push(professor);
    }

    // Get all modules
    const allModules = await Module.find({});
    console.log(`\n📚 Updating ${allModules.length} modules...\n`);

    let updated = 0;

    for (const module of allModules) {
      let assignedProfessor = null;
      const moduleCode = module.code;
      const moduleName = module.name.toLowerCase();

      // Assign professor based on module content
      if (module.department === 'COMMON') {
        // Soft skills and languages
        assignedProfessor = createdProfessors.find(p => 
          p.specialization.includes('Soft Skills') || 
          p.specialization.includes('Management')
        );
      } 
      // GI Modules
      else if (module.department === 'GI') {
        if (moduleCode.includes('101') || moduleCode.includes('102') || 
            moduleName.includes('algorithmique') || moduleName.includes('programmation')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Computer Science') || 
            p.specialization.includes('Programming')
          );
        }
        else if (moduleCode.includes('201') || moduleCode.includes('202') || 
                 moduleName.includes('math') || moduleName.includes('analyse')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Mathematics')
          );
        }
        else if (moduleCode.includes('203') || moduleCode.includes('204') || 
                 moduleName.includes('base de données') || moduleName.includes('sql')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Databases')
          );
        }
        else if (moduleCode.includes('205') || moduleCode.includes('304') || 
                 moduleName.includes('réseaux') || moduleName.includes('securité')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Networks') || 
            p.specialization.includes('Security')
          );
        }
        else if (moduleCode.includes('301') || moduleCode.includes('302') || 
                 moduleName.includes('avancée') || moduleName.includes('web')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Software Engineering') || 
            p.specialization.includes('Web Development')
          );
        }
        else if (moduleCode.includes('401') || moduleCode.includes('402') || 
                 moduleName.includes('intelligence') || moduleName.includes('mobile')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Software Engineering') || 
            p.specialization.includes('Programming')
          );
        }
        else if (moduleCode.includes('501') || moduleCode.includes('502') || 
                 moduleName.includes('big data') || moduleName.includes('machine learning')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Data Science') || 
            p.specialization.includes('AI')
          );
        }
        else if (moduleCode.includes('601') || moduleCode.includes('602') || 
                 moduleName.includes('deep learning') || moduleName.includes('iot')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Data Science') || 
            p.specialization.includes('AI')
          );
        }
      }
      // IDS Modules
      else if (module.department === 'IDS') {
        if (moduleCode.includes('101') || moduleCode.includes('102') || 
            moduleName.includes('algorithmique') || moduleName.includes('programmation')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Computer Science') || 
            p.specialization.includes('Programming')
          );
        }
        else if (moduleCode.includes('103') || moduleCode.includes('202') || 
                 moduleName.includes('math') || moduleName.includes('statistiques')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Mathematics') || 
            p.specialization.includes('Statistics')
          );
        }
        else if (moduleCode.includes('104') || moduleCode.includes('204') || 
                 moduleName.includes('base de données') || moduleName.includes('sql')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Databases')
          );
        }
        else if (moduleCode.includes('301') || moduleCode.includes('302') || 
                 moduleName.includes('data mining') || moduleName.includes('machine learning')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Data Science') || 
            p.specialization.includes('AI')
          );
        }
        else if (moduleCode.includes('303') || moduleCode.includes('403') || 
                 moduleName.includes('big data') || moduleName.includes('data warehousing')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Big Data') || 
            p.specialization.includes('Data Science')
          );
        }
        else if (moduleCode.includes('401') || moduleCode.includes('402') || 
                 moduleName.includes('deep learning') || moduleName.includes('data engineering')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Data Science') || 
            p.specialization.includes('AI')
          );
        }
        else if (moduleCode.includes('501') || moduleCode.includes('502') || 
                 moduleName.includes('data science') || moduleName.includes('analytics')) {
          assignedProfessor = createdProfessors.find(p => 
            p.specialization.includes('Data Science') || 
            p.specialization.includes('Big Data')
          );
        }
      }

      // If no professor assigned, assign to first professor
      if (!assignedProfessor) {
        assignedProfessor = createdProfessors[0];
      }

      if (module.professor?.toString() !== assignedProfessor._id.toString()) {
        module.professor = assignedProfessor._id;
        await module.save();
        updated++;
        console.log(`  📖 ${module.code} → ${assignedProfessor.name} ${assignedProfessor.prenom} (${assignedProfessor.specialization})`);
      }
    }

    console.log(`\n✅ Updated ${updated} modules with correct professors`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 PROFESSOR ASSIGNMENT SUMMARY');
    console.log('='.repeat(60));
    
    for (const prof of createdProfessors) {
      const moduleCount = await Module.countDocuments({ professor: prof._id });
      console.log(`${prof.name} ${prof.prenom} (${prof.specialization}): ${moduleCount} modules`);
    }

    await mongoose.disconnect();
    console.log('\n✨ Assignment complete! Refresh your browser to see changes.');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

assignProfessorsBySpecialization();