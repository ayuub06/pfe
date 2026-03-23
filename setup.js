const fs = require('fs');
const path = require('path');

// Create directories
const dirs = ['config', 'models', 'middleware', 'controllers', 'routes'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// File contents (simplified versions - you'll need to add the full code)
const files = {
  'server.js': `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university_exam_db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.json({ message: 'University Exam Management API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
  
  'config/db.js': `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university_exam_db');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;`,
  
  '.env': `PORT=5000
MONGODB_URI=mongodb://localhost:27017/university_exam_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development`
};

// Create files
Object.entries(files).forEach(([filename, content]) => {
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, content);
  console.log(`Created ${filename}`);
});

console.log('Setup complete! Now add the full code from the tutorial to each file.');