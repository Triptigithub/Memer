const express = require('express');
const router = express.Router();
const { getCaption, getVibe } = require('../controllers/ai');

const rateLimit = require('express-rate-limit');

const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: {
    status: 'error',
    message: 'Too many AI requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(aiRateLimit);

router.post('/caption', getCaption);
router.post('/vibe', getVibe);

module.exports = router;