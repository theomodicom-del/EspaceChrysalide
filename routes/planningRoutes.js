const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', planningController.getAllEvents);
router.post('/', verifyToken, isAdmin, planningController.createEvent);
router.put('/:id', verifyToken, isAdmin, planningController.updateEvent);
router.delete('/:id', verifyToken, isAdmin, planningController.deleteEvent);

module.exports = router;