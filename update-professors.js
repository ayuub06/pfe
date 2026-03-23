const mongoose = require('mongoose');
const User = require('./models/User');
const Module = require('./models/Module');

const updateProfessors = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/university_exam_db');
    console.log('Connected to MongoDB\n');

    // New professors data
    const newProfessors = [
      {
        name: 'Dr. Fauzi',
        prenom: 'Hassan',
        email: 'fauzi.hassan@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Computer Science'
      },
      {
        name: 'Rachid',
        prenom: 'Ait Daoud',
        email: 'rachid.aitdaoud@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Mathematics'
      },
      {
        name: 'Dr. Hammime',
        prenom: 'Ali',
        email: 'hammime.ali@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Programming'
      },
      {
        name: 'Dr. Amin',
        prenom: 'Mohammed',
        email: 'amin.mohammed@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Databases'
      },
      {
        name: 'Dr. Regragui',
        prenom: 'Younes',
        email: 'regragui.younes@university.com',
        password: 'prof123',
        role: 'professeur',
        specialization: 'Networks'
      }
    ];

    // Get existing professors to delete
    const existingProfessors = await User.find({ role: 'professeur' });
    console.log(`Found ${existingProfessors.length} existing professors\n`);

    // Delete all existing professors (optional - be careful!)
    for (const prof of existingProfessors) {
      // Check if this professor has modules assigned
      const modules = await Module.find({ professor: prof._id });
      if (modules.length > 0) {
        console.log(`⚠️ Professor ${prof.email} has ${modules.length} modules assigned. Updating modules...`);
        // Update modules to new professor (we'll handle this later)
        for (const module of modules) {
          console.log(`   Module: ${module.code} - ${module.name}`);
        }
      }
      
      // Delete the professor
      await User.findByIdAndDelete(prof._id);
      console.log(`🗑️ Deleted: ${prof.name} ${prof.prenom} (${prof.email})`);
    }

    console.log(`\n📝 Creating new professors...\n`);

    // Create new professors
    const createdProfessors = [];
    for (const profData of newProfessors) {
      const professor = new User(profData);
      await professor.save();
      createdProfessors.push(professor);
      console.log(`✅ Created: ${profData.name} ${profData.prenom} - ${profData.email} (${profData.specialization})`);
    }

    // Update modules to assign to new professors
    const allModules = await Module.find({});
    console.log(`\n📚 Updating ${allModules.length} modules with new professors...\n`);

    // Assign modules to appropriate professors based on specialization
    for (const module of allModules) {
      let newProfessor = null;
      
      if (module.code.includes('GI') || module.code.includes('Algorithmique') || module.code.includes('Programmation')) {
        newProfessor = createdProfessors.find(p => p.specialization === 'Computer Science' || p.specialization === 'Programming');
      } else if (module.code.includes('Math') || module.code.includes('Statistiques')) {
        newProfessor = createdProfessors.find(p => p.specialization === 'Mathematics');
      } else if (module.code.includes('BD') || module.code.includes('SQL') || module.code.includes('NoSQL') || module.code.includes('Base')) {
        newProfessor = createdProfessors.find(p => p.specialization === 'Databases');
      } else if (module.code.includes('Reseau') || module.code.includes('Security') || module.code.includes('Sécurité')) {
        newProfessor = createdProfessors.find(p => p.specialization === 'Networks');
      } else if (module.code.includes('ML') || module.code.includes('Big Data') || module.code.includes('Data')) {
        newProfessor = createdProfessors.find(p => p.specialization === 'Computer Science');
      } else {
        newProfessor = createdProfessors[0]; // Default to first professor
      }

      if (newProfessor) {
        module.professor = newProfessor._id;
        await module.save();
        console.log(`   ✅ ${module.code} - ${module.name} → ${newProfessor.name} ${newProfessor.prenom}`);
      }
    }

    console.log(`\n✨ Professor update complete!`);
    console.log(`\n📊 New Professors:`);
    for (const prof of createdProfessors) {
      const moduleCount = await Module.countDocuments({ professor: prof._id });
      console.log(`   👨‍🏫 ${prof.name} ${prof.prenom} (${prof.specialization}) - ${moduleCount} modules`);
    }

    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
};

updateProfessors();