const express = require('express');
const router = express.Router();
const schedulingController = require('../controllers/schedulingController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Auto-generate schedule (admin only)
router.post('/auto-generate', authMiddleware, roleMiddleware('admin'), schedulingController.autoGenerateSchedule);

// Manual schedule exam (admin only)
router.post('/manual', authMiddleware, roleMiddleware('admin'), schedulingController.scheduleExam);

// Check availability
router.post('/check-availability', authMiddleware, schedulingController.checkAvailability);

module.exports = router;