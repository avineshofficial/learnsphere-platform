const express = require('express');
const router = express.Router();
// CORRECTLY IMPORT ALL THREE FUNCTIONS
const { markLessonAsComplete, getUserProgress, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/progress', protect, markLessonAsComplete);
router.get('/progress', protect, getUserProgress);

// THIS IS THE ROUTE THAT WAS LIKELY CAUSING THE ERROR
router.get('/profile', protect, getUserProfile); 

module.exports = router;