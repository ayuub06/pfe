const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
// router.post('/register', authController.register); // DISABLED - No public registration
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.get('/users', authMiddleware, roleMiddleware('admin'), authController.getAllUsers);

// Admin only - to create new users (students, professors, admins)
router.post('/admin/create-user', 
  authMiddleware, 
  roleMiddleware('admin'), 
  authController.createUserByAdmin
);

module.exports = router;