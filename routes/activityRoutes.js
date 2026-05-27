const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.get('/', activityController.getAllActivities);
router.post('/', verifyToken, isAdmin, upload.single('imageFile'), activityController.createActivity);
router.put('/:id', verifyToken, isAdmin, upload.single('imageFile'), activityController.updateActivity);
router.delete('/:id', verifyToken, isAdmin, activityController.deleteActivity);

module.exports = router;