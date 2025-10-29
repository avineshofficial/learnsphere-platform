const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

// We protect this route to prevent unauthorized API usage
router.post('/generate', protect, generateResponse);

module.exports = router;