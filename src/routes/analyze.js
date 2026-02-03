/**
 * Password Analysis API Route
 */
const express = require('express');
const router = express.Router();
const { calculateEntropy, calculateScore, getFeedback, calculateCrackTime } = require('../utils/entropy');

/**
 * POST /api/analyze/
 * Analyze password strength and return entropy, score, and crack times
 */
router.post('/', (req, res) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    
    const entropy = calculateEntropy(password);
    const score = calculateScore(entropy);
    const feedback = getFeedback(score);
    
    const crackTimes = {
        online_throttling: { display: calculateCrackTime(entropy, 100 / 3600) },
        online_no_throttling: { display: calculateCrackTime(entropy, 10) },
        offline_slow: { display: calculateCrackTime(entropy, 10000) },
        offline_fast: { display: calculateCrackTime(entropy, 10000000000) }
    };
    
    res.json({
        entropy,
        score,
        password_length: password.length,
        feedback,
        crack_times: crackTimes
    });
});

module.exports = router;
