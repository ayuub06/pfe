const mongoose = require('mongoose');
const User = require('./models/User');
const Module = require('./models/Module');

const reassignModulesToAllProfessors = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // Get all professors
    const professors = await User.find({ role: 'professeur' });
    console.log(`👨‍🏫 Found ${professors.length} professors\n`);

    // Create professor mapping by specialization
    const professorMap = {};
    for (const prof of professors) {
      professorMap[prof.specialization.toLowerCase()] = prof;
      console.log(`   ${prof.name} ${prof.prenom}: ${prof.specialization}`);
    }

    console.log('\n📚 Reassigning modules...\n');

    // Get all modules
    const allModules = await Module.find({});
    console.log(`Found ${allModules.length} modules to reassign\n`);

    let reassigned = 0;
    let skipped = 0;

    for (const module of allModules) {
      const moduleName = module.name.toLowerCase();
      const moduleCode = module.code.toLowerCase();
      let assignedProfessor = null;

      // Assignment logic based on module content
      // Computer Science & Programming
      if (moduleName.includes('algorithmique') || moduleName.includes('programmation') ||
          moduleCode.includes('101') && (moduleCode.includes('gi') || moduleCode.includes('ids'))) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Computer Science') || 
          p.specialization.includes('Programming') ||
          p.specialization.includes('Algorithmics')
        );
      }
      // Web Development
      else if (moduleName.includes('web') || moduleName.includes('html') || moduleName.includes('css') ||
               moduleName.includes('javascript') || moduleName.includes('react')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Web Development') || 
          p.specialization.includes('Frontend') ||
          p.specialization.includes('Backend')
        );
      }
      // Mobile Development
      else if (moduleName.includes('mobile') || moduleName.includes('android') || moduleName.includes('flutter')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Mobile Development')
        );
      }
      // Software Engineering
      else if (moduleName.includes('génie logiciel') || moduleName.includes('software') || 
               moduleName.includes('devops')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Software Engineering') || 
          p.specialization.includes('DevOps')
        );
      }
      // Mathematics
      else if (moduleName.includes('math') || moduleName.includes('algèbre') || 
               moduleName.includes('analyse') || moduleName.includes('probabilités')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Mathematics') || 
          p.specialization.includes('Probability') ||
          p.specialization.includes('Analysis')
        );
      }
      // Statistics
      else if (moduleName.includes('statistiques') || moduleName.includes('statistics')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Statistics')
        );
      }
      // Databases
      else if (moduleName.includes('base de données') || moduleName.includes('sql') || 
               moduleName.includes('nosql') || moduleName.includes('data warehousing')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Databases') || 
          p.specialization.includes('NoSQL') ||
          p.specialization.includes('Data Warehousing')
        );
      }
      // Big Data
      else if (moduleName.includes('big data') || moduleName.includes('hadoop') || 
               moduleName.includes('spark')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Big Data')
        );
      }
      // Networks
      else if (moduleName.includes('réseaux') || moduleName.includes('networks') || 
               moduleName.includes('tcp/ip')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Networks')
        );
      }
      // Security
      else if (moduleName.includes('sécurité') || moduleName.includes('cybersécurité') || 
               moduleName.includes('security') || moduleName.includes('ethical')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Cybersecurity') || 
          p.specialization.includes('Security')
        );
      }
      // Cloud Computing
      else if (moduleName.includes('cloud') || moduleName.includes('cloud native')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Cloud Computing') || 
          p.specialization.includes('DevOps')
        );
      }
      // Data Science & AI
      else if (moduleName.includes('data science') || moduleName.includes('machine learning') || 
               moduleName.includes('deep learning') || moduleName.includes('artificial intelligence') ||
               moduleName.includes('ai') || moduleName.includes('ml')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Data Science') || 
          p.specialization.includes('Artificial Intelligence') ||
          p.specialization.includes('Deep Learning') ||
          p.specialization.includes('Machine Learning')
        );
      }
      // Data Mining
      else if (moduleName.includes('data mining') || moduleName.includes('mining')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Data Mining') || 
          p.specialization.includes('Data Science')
        );
      }
      // Soft Skills & Management
      else if (moduleName.includes('gestion') || moduleName.includes('management') || 
               moduleName.includes('entrepreneuriat') || moduleName.includes('leadership')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('Project Management') || 
          p.specialization.includes('Management')
        );
      }
      // Languages
      else if (moduleName.includes('anglais') || moduleName.includes('english') || 
               moduleName.includes('communication') || moduleName.includes('expression')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('English') || 
          p.specialization.includes('Business Communication') ||
          p.specialization.includes('Soft Skills')
        );
      }
      // System Architecture
      else if (moduleName.includes('architecture') || moduleName.includes('systèmes')) {
        assignedProfessor = professors.find(p => 
          p.specialization.includes('System Architecture')
        );
      }

      // If still no professor assigned, assign to first professor with matching department
      if (!assignedProfessor) {
        if (module.department === 'GI') {
          assignedProfessor = professors.find(p => 
            p.specialization.includes('Computer Science') || 
            p.specialization.includes('Programming')
          );
        } else if (module.department === 'IDS') {
          assignedProfessor = professors.find(p => 
            p.specialization.includes('Data Science') || 
            p.specialization.includes('Big Data')
          );
        } else if (module.department === 'COMMON') {
          assignedProfessor = professors.find(p => 
            p.specialization.includes('Soft Skills') || 
            p.specialization.includes('English') ||
            p.specialization.includes('Management')
          );
        }
      }

      // Final fallback - assign to any professor
      if (!assignedProfessor) {
        assignedProfessor = professors[0];
      }

      if (module.professor?.toString() !== assignedProfessor._id.toString()) {
        module.professor = assignedProfessor._id;
        await module.save();
        reassigned++;
        console.log(`   📖 ${module.code} → ${assignedProfessor.name} ${assignedProfessor.prenom} (${assignedProfessor.specialization})`);
      } else {
        skipped++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 ASSIGNMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Reassigned: ${reassigned} modules`);
    console.log(`⏭️ Already correct: ${skipped} modules`);

    // Show distribution by professor
    console.log('\n📋 Module Distribution by Professor:');
    console.log('-'.repeat(60));
    
    for (const prof of professors) {
      const moduleCount = await Module.countDocuments({ professor: prof._id });
      if (moduleCount > 0) {
        console.log(`   ${prof.name} ${prof.prenom} (${prof.specialization}): ${moduleCount} modules`);
      }
    }

    const totalModules = await Module.countDocuments();
    console.log('\n' + '='.repeat(60));
    console.log(`Total Modules: ${totalModules}`);
    console.log(`Total Professors: ${professors.length}`);
    console.log(`Average modules per professor: ${Math.round(totalModules / professors.length)}`);
    
    await mongoose.disconnect();
    console.log('\n✨ Module reassignment complete! Refresh your browser to see changes.');
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

reassignModulesToAllProfessors();