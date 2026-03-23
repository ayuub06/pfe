 
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, roleMiddleware('admin'), roomController.createRoom);
router.get('/', authMiddleware, roomController.getAllRooms);
router.get('/:id', authMiddleware, roomController.getRoomById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), roomController.updateRoom);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), roomController.deleteRoom);
router.post('/check-availability', authMiddleware, roomController.checkAvailability);

module.exports = router;